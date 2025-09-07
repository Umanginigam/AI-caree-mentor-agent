# ---------- Base Image ----------
FROM python:3.10-slim AS base

WORKDIR /app

# Set environment variables for faster installs and safer runs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ---------- Install System Dependencies ----------
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ---------- Install Python Dependencies ----------
# Copy only requirements first to leverage Docker cache
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ---------- Download SpaCy Model ----------
RUN python -m spacy download en_core_web_sm

# ---------- Copy Application Code ----------
COPY ./app ./app

# ---------- Expose Port ----------
# Railway uses $PORT env variable, default to 8000
ENV PORT=8000
EXPOSE $PORT

# ---------- Start Command ----------
# Use uvicorn with env PORT for Railway
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
