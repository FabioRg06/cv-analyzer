from abc import ABC, abstractmethod

class AnalyzerInterface(ABC):
    @abstractmethod
    def analyze(self, cv_text: str, job_description: str) -> dict:
        pass
