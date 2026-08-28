# backend/api/services/vectorstore.py

import os
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document as LangchainDocument

OLLAMA_BASE_URL = os.environ.get('OLLAMA_BASE_URL', 'http://localhost:11434')
CHROMA_PERSIST_DIR = os.environ.get('CHROMA_PERSIST_DIR', './chroma_data')

# jedan zajednicki embedding objekat - LangChain ga koristi
# i pri upisu (add) i pri pretrazi (search), sto garantuje isti model oba puta
embeddings = OllamaEmbeddings(model="nomic-embed-text", base_url=OLLAMA_BASE_URL)

vectorstore = Chroma(collection_name="knowledge_base",embedding_function=embeddings,persist_directory=CHROMA_PERSIST_DIR)


def add_paragraphs(paragraphs, user_id, document_id, document_title):
    """
    Upisuje listu Paragraph objekata (Django modeli) u Chroma.
    Poziva se pri upload-u/reindeksiranju dokumenta.
    """
    docs = [
        LangchainDocument(
            page_content=p.content,
            metadata={
                "user_id": user_id,
                "document_id": document_id,
                "document_title": document_title,
                "paragraph_id": p.id,
            }
        )
        for p in paragraphs
    ]
    ids = [f"paragraph_{p.id}" for p in paragraphs]
    vectorstore.add_documents(docs, ids=ids)


def delete_document_vectors(document_id):
    """
    Brise sve vektore vezane za jedan dokument (pri brisanju/reindeksiranju).
    """
    vectorstore.delete(where={"document_id": document_id})


def search_similar_paragraphs(query, user_id, top_k=4):
    """
    Pretrazuje Chroma SAMO u okviru datog korisnika (kriticno za izolaciju).
    Vraca listu recnika spremnih za rag_pipeline.py.
    """
    results = vectorstore.similarity_search(
        query,
        k=top_k,
        filter={"user_id": user_id}
    )
    return [
        {
            "document_id": r.metadata["document_id"],
            "document_title": r.metadata["document_title"],
            "paragraph_id": r.metadata["paragraph_id"],
            "content": r.page_content,
        }
        for r in results
    ]