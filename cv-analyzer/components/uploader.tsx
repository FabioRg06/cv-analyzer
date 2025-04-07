"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, CheckCircle, FileUp } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { ResultsDisplay } from "./results-display"
import { uploadFile } from "@/app/services/api"
import { motion, AnimatePresence } from "framer-motion"
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
      alert("Please upload a PDF or Word document (.doc, .docx)")
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
      alert("we need your CV to analyze it :)")
      return;
    }
  
    if (!jobDescription.trim()) {
      alert("don't forget to paste the job description :)")
      return;
    }
  
    setIsAnalyzing(true);
    setProgress(0);
  
    // Simula la carga del progreso
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);
  
    const analysis = await uploadFile(file, jobDescription);
  
    clearInterval(interval);
    setProgress(100);
  
    if (analysis) {
      setAnalysisData({
        compatibilityScore: analysis.compatibilityScore,
        matchingSkills: analysis.matchingSkills,
        missingSkills: analysis.missingSkills,
        recommendations: analysis.recommendations,
      });
      setShowResults(true);
    } else {
      alert("mmm...we are having some issues with the analysis, please try again later");
    }
  
    setIsAnalyzing(false);
  };

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
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Card className="overflow-hidden border-primary/20 hover:shadow-md transition-shadow duration-300">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Upload your CV</h2>
            <p className="text-sm text-muted-foreground">Supported formats: PDF, DOCX</p>
          </div>
          <CardContent className="p-6">
            <motion.div
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
              whileHover={!file ? { scale: 1.01 } : {}}
              whileTap={!file ? { scale: 0.98 } : {}}
            >
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file-selected"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center gap-2 text-center"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FileText className="h-8 w-8 text-primary" />
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{file.name}</span>
                    </motion.div>
                    <motion.p
                      className="text-sm text-muted-foreground mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      File successfully selected
                    </motion.p>
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFile(null)
                        }}
                        className="mt-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        Change file
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload-prompt"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center text-center cursor-pointer"
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                      animate={{
                        y: [0, -5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                        repeatType: "reverse",
                      }}
                    >
                      <Upload className="h-10 w-10 text-primary" />
                    </motion.div>
                    <motion.h3
                      className="text-lg font-medium mb-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      {isDragging ? "Drop your file here" : "Drag and drop your CV here"}
                    </motion.h3>
                    <motion.p
                      className="text-sm text-muted-foreground mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      or
                    </motion.p>
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" className="relative z-10 group">
                        <FileUp className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        Select file
                      </Button>
                    </motion.div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-primary/20 hover:shadow-md transition-shadow duration-300">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Job Description</h2>
            <p className="text-sm text-muted-foreground">
            Paste the job description to analyze compatibility
            </p>
          </div>
          <CardContent className="p-6">
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-[200px] resize-none focus-visible:ring-primary transition-all duration-200"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 py-4"
          >
            <p className="text-center font-medium">Analyzing your CV...</p>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
            We're comparing your skills with the job requirements
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="analyze-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className="w-full relative overflow-hidden group"
              size="lg"
              onClick={handleAnalyze}
              disabled={!file || !jobDescription.trim()}
              
            >
              <span className="relative z-10">Analyze Compatibility</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

