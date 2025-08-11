# app/embeddings.py

from langchain.embeddings import HuggingFaceEmbeddings

from app.config import EMBEDDING_MODEL_NAME

def get_embedding_model():
    model_kwargs = {"device": "cpu"}
    encode_kwargs = {"normalize_embeddings": True}  # important for cosine similarity

    embedding = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs=model_kwargs,
        encode_kwargs=encode_kwargs
    )
    return embedding
