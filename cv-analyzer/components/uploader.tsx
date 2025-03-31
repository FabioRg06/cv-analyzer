"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ResultsDisplay } from "./results-display"
import { uploadFile } from "@/app/services/api"

export function Uploader() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [analysisData, setAnalysisData] = useState<{
    compatibilityScore: number
    matchingSkills: string[]
    missingSkills: string[]
    recommendations: string[]
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    const fileType = selectedFile.type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ]

    if (validTypes.includes(fileType)) {
      setFile(selectedFile)
    } else {
      alert("Por favor, sube un documento PDF o Word (.doc, .docx)")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleAnalyze = async () => {
    if (!file) {
      alert("Por favor, sube tu CV")
      return
    }

    if (!jobDescription.trim()) {
      alert("Por favor, ingresa una descripción del trabajo")
      return
    }

    setIsAnalyzing(true)

    const analysis = await uploadFile(file, jobDescription)

    if (analysis) {
      console.log("Análisis de IA:", analysis)
      setAnalysisData({
        compatibilityScore: analysis.compatibilityScore,
        matchingSkills: analysis.matchingSkills,
        missingSkills: analysis.missingSkills,
        recommendations: analysis.recommendations,
      })
      setShowResults(true)
    } else {
      alert("Hubo un error al procesar el archivo")
    }

    setIsAnalyzing(false)
  }

  const resetForm = () => {
    setFile(null)
    setJobDescription("")
    setShowResults(false)
    setProgress(0)
    setAnalysisData(null)
  }

  if (showResults && analysisData) {
    return <ResultsDisplay onReset={resetForm} analysisData={analysisData} />
  }
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/20">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Sube tu CV</h2>
          <p className="text-sm text-muted-foreground">Formatos soportados: PDF, DOCX</p>
        </div>
        <CardContent className="p-6">
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 transition-all duration-200
              ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[0.99]"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
              }
              ${file ? "bg-muted/30" : ""}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={!file ? handleBoxClick : undefined}
          >
            {file ? (
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Archivo seleccionado correctamente</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="mt-2"
                >
                  Cambiar archivo
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {isDragging ? "Suelta tu archivo aquí" : "Arrastra y suelta tu CV aquí"}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">o</p>
                <Button variant="outline" className="relative z-10">
                  Seleccionar archivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-primary/20">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Descripción del Trabajo</h2>
          <p className="text-sm text-muted-foreground">
            Pega la descripción del trabajo para analizar la compatibilidad
          </p>
        </div>
        <CardContent className="p-6">
          <Textarea
            placeholder="Pega la descripción del trabajo aquí..."
            className="min-h-[200px] resize-none focus-visible:ring-primary"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </CardContent>
      </Card>

      {isAnalyzing ? (
        <div className="space-y-4 py-4">
          <p className="text-center font-medium">Analizando tu CV...</p>
          <Progress value={progress} className="h-2" />
          <p className="text-center text-sm text-muted-foreground">
            Estamos comparando tus habilidades con los requisitos del trabajo
          </p>
        </div>
      ) : (
        <Button
          className="w-full relative overflow-hidden group"
          size="lg"
          onClick={handleAnalyze}
          disabled={!file || !jobDescription.trim()}
        >
          <span className="relative z-10">Analizar Compatibilidad</span>
          <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Button>
      )}
    </div>
  )
}

