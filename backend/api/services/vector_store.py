from django.conf import settings
from langchain_chroma import Chroma

from .embeddings import get_embeddings_model

CHROMA_DIR = str(settings.BASE_DIR / "chroma_db")
COLLECTION_NAME = "paragraphs"

_vectorstore_instance = None


def get_vectorstore(): # singleton, vraca instancu za komunikaciju sa bazom
    global _vectorstore_instance

    if _vectorstore_instance is None:
        _vectorstore_instance = Chroma(
            collection_name=COLLECTION_NAME,
            embedding_function=get_embeddings_model(),
            persist_directory=CHROMA_DIR,
        )

    return _vectorstore_instance


def add_paragraphs(paragraphs, user_id, document_id, document_title):
    if not paragraphs:
        return

    vectorstore = get_vectorstore()

    ids = [str(p.id) for p in paragraphs] # lista ideva ali kao str, chroma tako zahteva
    texts = [p.content for p in paragraphs]
    metadatas = [
        {
            "paragraph_id": p.id,
            "document_id": document_id,
            "user_id": user_id,
            "document_title": document_title,
        }
        for p in paragraphs
    ]

    vectorstore.add_texts(texts=texts, metadatas=metadatas, ids=ids) # cuva u chromadb


def delete_document_vectors(document_id):
    vectorstore = get_vectorstore()
    vectorstore.delete(where={"document_id": document_id})


def search_similar_paragraphs(query, user_id, top_k=4):
    vectorstore = get_vectorstore()
    results = vectorstore.similarity_search(query, k=top_k, filter={"user_id": user_id})
    # uzima se pitanje korisnika, pretvara se u vektor i trazi k najslicnijih zapisa u bazi

    return [
        {
            "document_id": r.metadata["document_id"],
            "document_title": r.metadata["document_title"],
            "paragraph_id": r.metadata["paragraph_id"],
            "content": r.page_content,
        }
        for r in results
    ]