# backend/app/services/parser.py
import os
from pdfminer.high_level import extract_text
import docx2txt

def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text(file_path)
    elif ext in [".docx", ".doc"]:
        return docx2txt.process(file_path)
    else:
        raise ValueError("Unsupported file format. Only PDF and DOCX are allowed.")
