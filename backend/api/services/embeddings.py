import os
from langchain_ollama import OllamaEmbeddings

EMBEDDING_MODEL_NAME = "nomic-embed-text"
OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")

_embeddings_instance = None


def get_embeddings_model():
    global _embeddings_instance # odnosi se na promenljivu ciji scope iznad

    if _embeddings_instance is None:
        _embeddings_instance = OllamaEmbeddings( # isntanca koja sadrzi model i ollama url
            model=EMBEDDING_MODEL_NAME,
            base_url=OLLAMA_BASE_URL,
        )

    return _embeddings_instance # kad se pozove langchain salje zahteve 