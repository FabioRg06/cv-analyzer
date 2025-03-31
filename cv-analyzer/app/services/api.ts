export const uploadFile = async (file: File, jobDescription: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);
  
    try {
      const response = await fetch("http://localhost:8000/api/upload/", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      
  
      if (!response.ok) {
        throw new Error(data.error || "Error al analizar el archivo");
      }
  
      return data.analysis; // Retorna el análisis de IA
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };
  