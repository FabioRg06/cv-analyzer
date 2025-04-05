from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services.file_extractor import FileExtractor  # Cambia esto por el extractor que necesites
from .services.gemini_analyzer import GeminiAnalyzer  # Puedes cambiarlo por otro sin tocar la vista

class UploadFileView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.extractor = FileExtractor()
        self.analyzer = GeminiAnalyzer()  # Inyecta aquí el servicio según la interfaz

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        job_description = request.data.get("job_description", "")

        if not uploaded_file:
            return Response({"error": "Archivo no recibido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cv_text = self.extractor.extract_text(uploaded_file)
            analysis = self.analyzer.analyze(cv_text, job_description)

            if "error" in analysis:
                return Response(analysis, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({"analysis": analysis}, status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": f"Error inesperado: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
