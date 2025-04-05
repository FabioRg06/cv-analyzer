from django.urls import path
from .views import UploadFileView

urlpatterns = [
    # Define your URL patterns here
    path('upload/', UploadFileView.as_view() , name='analyze'),
    
]