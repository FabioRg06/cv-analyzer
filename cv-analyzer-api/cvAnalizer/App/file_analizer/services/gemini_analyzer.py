import os
import json
from dotenv import load_dotenv
from google import genai
from ..interfaces.analyzer_interface import AnalyzerInterface
from ..prompts.gemini_prompt import PROMPT 

load_dotenv()

class GeminiAnalyzer(AnalyzerInterface):
    def __init__(self):
        api_key = os.getenv("API_KEY")
        if not api_key:
            raise EnvironmentError("API_KEY no encontrada en variables de entorno")
        self.client = genai.Client(api_key=api_key)

    def analyze(self, cv_text: str, job_description: str) -> dict:
        prompt = PROMPT(cv_text, job_description)
        if prompt != "NO ES UN CV":

            try:
                response = self.client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=prompt,
                    config={"response_mime_type": "application/json"}
                )

                if hasattr(response, "text"):
                    return json.loads(response.text)

                return {"error": "Respuesta no válida de Gemini"}

            except Exception as e:
                return {"error": f"Error con Gemini: {str(e)}"}
        else:
            return {"error": "El documento no es un CV."}