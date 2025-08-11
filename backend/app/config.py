# app/config.py

import os
from dotenv import load_dotenv

load_dotenv()

# Constants
PDF_DIR = "data"
CHROMA_DB_DIR = "chroma_db"

# BAAI embedding model (compact and good quality)
EMBEDDING_MODEL_NAME = "BAAI/bge-small-en-v1.5"

# Chunking
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

# OpenRouter config
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_BASE = "https://openrouter.ai/api/v1"

# Model name (can adjust via .env if needed)
LLM_MODEL_NAME = "openai/gpt-4o-mini"

