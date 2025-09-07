# backend/app/services/skill_extractor.py
import re
from typing import List, Tuple, Set
import spacy

# Load spaCy model once
nlp = spacy.load("en_core_web_sm")

# Basic canonicalization map (extend this)
CANONICAL_MAP = {
    "py": "python",
    "python3": "python",
    "google cloud": "gcp",
    "aws": "aws",
    "amazon web services": "aws",
    "dbs": "databases",
    "sql server": "sql",
    "postgre": "postgresql",
    "nlp": "nlp",
    "machine learning": "machine learning",
    "ml": "machine learning",
    "data viz": "data visualization",
    "tableau": "tableau",
    "power bi": "power bi",
    "pandas": "pandas",
    "numpy": "numpy",
}

# Regex patterns to locate 'Skills' section and common bullet/line separators
SKILLS_SECTION_HEADERS = [
    r"\bskills\b",
    r"\btechnical skills\b",
    r"\bcore competencies\b",
    r"\bexpertise\b",
]

# Any punctuation used to split items inside a skills line
SPLIT_PATTERN = re.compile(r"[•\-\n\r,;]+")  # bullets, hyphens, commas, semicolons, newlines


def find_skills_section(text: str) -> Tuple[int, int, str]:
    """
    Try to locate the start and end of the Skills section. Returns
    (start_idx, end_idx, section_text). If not found, returns (0, 0, '').
    Strategy:
      - find a header like 'Skills' and capture ~3 lines after it
      - fallback: look for common short lines with many comma-separated tokens
    """
    lowered = text.lower()
    for header in SKILLS_SECTION_HEADERS:
        m = re.search(header, lowered)
        if m:
            start = m.start()
            # heuristically take next 600 characters ( ~3-10 lines )
            end = start + 600
            section_text = text[start:end]
            return start, end, section_text

    # fallback: pick lines with many comma-separated tokens (likely skills list)
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if len(line.split(',')) >= 3 and len(line) < 200:
            # return this line (and next 2 lines)
            section_text = "\n".join(lines[i:i+3])
            # get char positions approx
            start = sum(len(l)+1 for l in lines[:i])
            end = start + len(section_text)
            return start, end, section_text

    return 0, 0, ""


def extract_skill_candidates_from_section(section_text: str) -> List[str]:
    """
    From the skills-section-like text, split on bullets/commas and return candidate tokens.
    """
    items = SPLIT_PATTERN.split(section_text)
    cleaned = []
    for it in items:
        it = it.strip()
        if not it:
            continue
        # remove extra parentheticals and years/percentages
        it = re.sub(r"\(.*?\)", "", it)
        it = re.sub(r"\d{1,3}%", "", it)
        it = it.strip()
        if len(it) >= 2 and len(it) < 60:
            cleaned.append(it)
    return cleaned


def extract_skills_from_text(text: str, top_k_named_entities: int = 50) -> List[str]:
    """
    Combined approach:
     1. Try to find a Skills section and split on bullets/commas.
     2. Use spaCy noun chunks and named entities to pick technical noun phrases.
     3. Merge and canonicalize.
    """
    skills: Set[str] = set()

    # 1) Section-based extraction
    _, _, section_text = find_skills_section(text)
    if section_text:
        candidates = extract_skill_candidates_from_section(section_text)
        for c in candidates:
            skills.add(c.lower())

    # 2) spaCy-based extraction from whole resume
    doc = nlp(text)
    # Named entities and noun chunks are good sources
    for ent in doc.ents[:top_k_named_entities]:
        # keep ORG/WORK_OF_ART/PRODUCT/TECH-like tokens
        if ent.label_ in ("ORG", "PRODUCT", "WORK_OF_ART", "LANGUAGE", "NORP", "TECHNOLOGY"):
            skills.add(ent.text.lower())
    # noun chunks: filter for short technical phrases
    for chunk in doc.noun_chunks:
        phrase = chunk.text.lower().strip()
        # heuristics: contain alnum and at least one short token, not full sentences
        if 1 <= len(phrase.split()) <= 4 and re.search(r"[a-zA-Z0-9\+\#\.\-]", phrase):
            # ignore stopwords-only chunks
            if len(phrase) > 1 and len(phrase) < 60:
                skills.add(phrase)

    # 3) post-process: canonicalize and filter
    processed = []
    for s in skills:
        s_norm = s.strip().lower()
        # basic lowercase and cleanup
        s_norm = re.sub(r"[^\w\s\+\#\.]", " ", s_norm)
        s_norm = re.sub(r"\s+", " ", s_norm).strip()

        # map some items to canonical names
        mapped = CANONICAL_MAP.get(s_norm, s_norm)
        # filter out near-english stopwords by naive heuristic
        if len(mapped) <= 2:
            continue
        # filter extremely long candidates
        if len(mapped) > 60:
            continue
        processed.append(mapped)

    # dedupe while preserving ordering-ish
    final = []
    for p in processed:
        if p not in final:
            final.append(p)

    return final
