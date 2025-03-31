import json
import os
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pdfminer.high_level import extract_text
from docx import Document
from google import genai  # Asegúrate de instalarlo: pip install google-generativeai

# Cargar variables de entorno
load_dotenv()

# Configurar cliente de Gemini con API Key
client = genai.Client(api_key=os.getenv("API_KEY"))

def analyze_resume(cv_text: str, job_description: str) -> dict:
    """
    Compara el texto del CV con la descripción del trabajo y devuelve el análisis de compatibilidad.
    """
    prompt = f"""
    Eres un experto en Recursos Humanos. Evalúa la compatibilidad de un candidato según su CV y la descripción del trabajo.

    CV del candidato:
    {cv_text}

    Descripción del trabajo:
    {job_description}

    Analiza la compatibilidad en base a experiencia, habilidades y educación. Devuelve un JSON con el siguiente formato:
    {{
        "compatibilityScore": 0-100,  
        "matchingSkills": ["habilidad 1", "habilidad 2"],  
        "missingSkills": ["habilidad faltante 1", "habilidad faltante 2"],  
        "recommendations": ["recomendación 1", "recomendación 2"]
    }}
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config={'response_mime_type': 'application/json'}  # 🔹 Pedimos JSON directamente
        )

        # Verificar si la API devolvió una respuesta
        if response and hasattr(response, "text"):
            return json.loads(response.text)  # Convertimos el string en JSON

        return {"error": "La API de Gemini no devolvió una respuesta válida."}

    except Exception as e:
        return {"error": f"Error en la API de Gemini: {str(e)}"}

def extract_text_from_file(uploaded_file):
    """Extrae texto de archivos PDF o DOCX."""
    file_extension = os.path.splitext(uploaded_file.name)[1].lower()

    try:
        if file_extension == ".pdf":
            return extract_text(uploaded_file)
        elif file_extension == ".docx":
            doc = Document(uploaded_file)
            return "\n".join([para.text for para in doc.paragraphs])
        else:
            raise ValueError("Formato no soportado")
    except Exception as e:
        raise ValueError(f"Error al procesar el archivo: {str(e)}")

class UploadFileView(APIView):

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        job_description = request.data.get("job_description", "")

        if not uploaded_file:
            return Response({"error": "No se recibió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cv_text = extract_text_from_file(uploaded_file)
            analysis = analyze_resume(cv_text, job_description)

            # Si hubo un error en la API, devolverlo
            if "error" in analysis:
                return Response(analysis, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({"analysis": analysis}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
