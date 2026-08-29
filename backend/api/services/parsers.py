from docx import Document as WordDocument
from pypdf import PdfReader


def _read_text_file(path):
    with open(path, "r", encoding="utf-8", errors="ignore") as file:
        return file.read() # vraca ceo tekst kao str


def _read_pdf_file(path):
    reader = PdfReader(path)
    pages = []

    for page in reader.pages: # nije isti pages ko ovaj iznad, ovo je reader atribut 
        text = page.extract_text()
        if text:
            pages.append(text)

    return "\n\n".join(pages) # join liste i dvored izmejdu stranica


def _read_docx_file(path):
    word_file = WordDocument(path)
    lines = []

    for p in word_file.paragraphs:
        text = p.text.strip()
        if text:
            lines.append(text)

    return "\n\n".join(lines) # isto samo sto je dvored izmedju paragrafa teskta


READERS = {
    ".txt": _read_text_file,
    ".md": _read_text_file,
    ".pdf": _read_pdf_file,
    ".docx": _read_docx_file,
}


def extract_raw_text(document):
    extension = document.file_type.lower()
    reader = READERS.get(extension)

    if reader is None:
        raise ValueError(f"Nepodržan tip fajla: {extension}")

    return reader(document.file.path) # poziva odgoarajucu fju