import os
from pdfminer.high_level import extract_text
from docx import Document

class FileExtractor:
    def extract_text(self, uploaded_file) -> str:
        ext = os.path.splitext(uploaded_file.name)[1].lower()

        try:
            if ext == ".pdf":
                return extract_text(uploaded_file)
            elif ext == ".docx":
                doc = Document(uploaded_file)
                return "\n".join([p.text for p in doc.paragraphs])
            else:
                raise ValueError("Formato no soportado")
        except Exception as e:
            raise ValueError(f"No se pudo procesar el archivo: {str(e)}")
