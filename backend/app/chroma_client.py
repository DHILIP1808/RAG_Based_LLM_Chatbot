# app/chroma_client.py

import os
from langchain.vectorstores import Chroma

from app.embeddings import get_embedding_model

from app.config import CHROMA_DB_DIR

COLLECTION_NAME = "agriculture_docs"

def load_or_create_chroma():
    embedding = get_embedding_model()
    print("[INFO] Loading existing ChromaDB...")
    vectordb = Chroma(
    persist_directory=CHROMA_DB_DIR,
    embedding_function=embedding,
    collection_name=COLLECTION_NAME
        )
    return vectordb.as_retriever(search_type="similarity", search_kwargs={"k": 4})
