from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from .vector_store import search_similar_paragraphs
import os

OLLAMA_BASE_URL = os.environ.get('OLLAMA_BASE_URL', 'http://localhost:11434')
llm = OllamaLLM(model="llama3.2:3b", base_url=OLLAMA_BASE_URL)

prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "Use only the context to generate answers. "
        "If the answer could not be found in the context, say you dont know the answer.\n\n"
        "Context:\n{context}\n\n"
        "Question: {question}"
    )
)

rag_chain = prompt_template | llm  # langchain expression language,  povezuje prompt i model u LANACCC
# prvo provuci kroz promptemplate i automatski salji llmu


def answer_question(user, question, top_k=4):
    """
    Glavna RAG funkcija koriscenjem LangChain-a: pretrazuje korisnikove
    dokumente preko Chroma-e, i generise odgovor preko Ollama LLM-a.
    """
    matches = search_similar_paragraphs(
        query=question,
        user_id=user.id,
        top_k=top_k
    )

    if not matches:
        return {
            "answer": "Nemam dovoljno informacija iz vasih dokumenata da odgovorim na ovo pitanje.",
            "sources": []
        }

    # spajamo sve paragrafe u kojima se nalaze relevantne informacije u jedan kontekst
    context = "\n\n---\n\n".join(m["content"] for m in matches)

    #pokrecemo lanac, i prosledjujemo kontekst i pitanje kojenam je neophodno za prompt teemplate strukturu gore definisanu
    try:
        answer = rag_chain.invoke({"context": context, "question": question})
    except Exception as e:
        raise Exception(f"Greska pri generisanju odgovora: {e}")

    seen_documents = set()
    sources = []

    for m in matches:
        if m["document_id"] in seen_documents:
            continue
        seen_documents.add(m["document_id"])
        sources.append({
            "document_id": m["document_id"],
            "document_title": m["document_title"],
            "paragraph_id": m["paragraph_id"],
            "content": m["content"][:200]
        }) # dokument se dodaje u izvor samo ako vec nije u izvoru

    return {"answer": answer, "sources": sources}