def PROMPT(cv_text: str, job_description: str) -> str:
    prompt = f"""
    Eres un experto en Recursos Humanos. Evalúa la compatibilidad de un candidato según su CV y la descripción del trabajo.
    CONSIDERACIONES:
    - El CV puede contener información sobre experiencia laboral, habilidades y educación.
    - La descripción del trabajo incluye requisitos y habilidades deseadas.
    - La evaluación debe ser objetiva y basada en datos.
    -EN CASO DE EL DOCUMENTO NO SEA SOBRE EL CV, RESPONDE CON "NO ES UN CV".
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
    return prompt