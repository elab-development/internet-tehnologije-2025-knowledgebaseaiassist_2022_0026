from langchain_text_splitters import RecursiveCharacterTextSplitter

from ..models import Paragraph


def chunk_and_save(document, raw_text):
    if not raw_text.strip():
        return [] # ako je raw text prazan onda nema chunkova

    splitter = RecursiveCharacterTextSplitter( # konstruktor,
        chunk_size=600, 
        chunk_overlap=80, # svaki chunk nosi 80 karaktera prethodnog
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks = splitter.split_text(raw_text) # vraca listu

    paragraphs = [ # list comperhension, u sustini u memoriji se prave parafgrafi i svaki ima dodeljen dokument kom pripada
        Paragraph(document=document, content=chunk.strip(), position=position)
        for position, chunk in enumerate(chunks, start=1) # enumerate daje indeks chunkovima, pocevsi od 1
        if chunk.strip()
    ]

    return Paragraph.objects.bulk_create(paragraphs) # dodaje u bazu