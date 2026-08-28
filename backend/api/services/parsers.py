import os
from docx import Document as WordDocument
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from .models import Paragraph

def _read_text_file(path): # cita ceo fajl i vraca sve kao str
    with open(path, "r", encoding="utf-8", errors="ignore") as file: 
        return file.read() 

def _read_pdf_file(path):
    reader = PdfReader(path)
    pages = [] 

    for page in reader.pages: # obj list
        text = page.extract_text()
        if text:
            pages.append(text)

    return "\n\n".join(pages) # spaja ih sve u jedan str, dvored izmedju stranica