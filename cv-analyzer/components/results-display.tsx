"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Download,
  Zap,
  Award,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Confetti from "react-confetti"
import { useWindowSize } from "@/app/hooks/use-window-size"
interface AnalysisResult {
  compatibilityScore: number
  matchingSkills: string[]
  missingSkills: string[]
  recommendations: string[]
}

interface ResultsDisplayProps {
  onReset: () => void
  analysisData: AnalysisResult
}

export function ResultsDisplay({ onReset, analysisData }: ResultsDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()
  const data = analysisData
  // Animar el contador de puntuación
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(data.compatibilityScore >= 90)
    }, 1500)

    const interval = setInterval(() => {
      setAnimatedScore((prev) => {
        if (prev < data.compatibilityScore) {
          return prev + 1
        }
        clearInterval(interval)
        return prev
      })
    }, 20)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [data.compatibilityScore])
  
  const getStatusMessages = (score: number) => {
    if (score >= 90) {
      return [
        {
          icon: <Award className="h-5 w-5 text-green-600 dark:text-green-500" />,
          title: "Excelente Compatibilidad",
          message: "Tu perfil es una coincidencia excepcional para esta posición",
          bgClass: "bg-green-50 dark:bg-green-950/30",
        },
        {
          icon: <ThumbsUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
          title: "Candidato Destacado",
          message: "Tienes todas las habilidades clave requeridas para el puesto",
          bgClass: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
          icon: <Zap className="h-5 w-5 text-purple-600 dark:text-purple-500" />,
          title: "Alta Probabilidad",
          message: "Tienes una alta probabilidad de avanzar en el proceso de selección",
          bgClass: "bg-purple-50 dark:bg-purple-950/30",
        },
      ]
    } else if (score >= 70) {
      return [
        {
          icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />,
          title: "Buena Compatibilidad",
          message: "Tu perfil es una buena coincidencia para esta posición",
          bgClass: "bg-green-50 dark:bg-green-950/30",
        },
        {
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />,
          title: "Algunas Brechas",
          message: "Hay algunas habilidades que podrías mejorar",
          bgClass: "bg-yellow-50 dark:bg-yellow-950/30",
        },
        {
          icon: <Zap className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
          title: "Potencial",
          message: "Con algunos ajustes, podrías ser un excelente candidato",
          bgClass: "bg-blue-50 dark:bg-blue-950/30",
        },
      ]
    } else if (score >= 50) {
      return [
        {
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />,
          title: "Compatibilidad Moderada",
          message: "Tu perfil coincide parcialmente con los requisitos",
          bgClass: "bg-yellow-50 dark:bg-yellow-950/30",
        },
        {
          icon: <XCircle className="h-5 w-5 text-orange-600 dark:text-orange-500" />,
          title: "Brechas Significativas",
          message: "Hay varias habilidades clave que necesitas desarrollar",
          bgClass: "bg-orange-50 dark:bg-orange-950/30",
        },
        {
          icon: <Zap className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
          title: "Oportunidad de Mejora",
          message: "Con formación adicional, podrías mejorar tu compatibilidad",
          bgClass: "bg-blue-50 dark:bg-blue-950/30",
        },
      ]
    } else {
      return [
        {
          icon: <ThumbsDown className="h-5 w-5 text-red-600 dark:text-red-500" />,
          title: "Baja Compatibilidad",
          message: "Tu perfil no coincide bien con los requisitos del puesto",
          bgClass: "bg-red-50 dark:bg-red-950/30",
        },
        {
          icon: <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />,
          title: "Habilidades Faltantes",
          message: "Te faltan varias habilidades esenciales para este puesto",
          bgClass: "bg-red-50 dark:bg-red-950/30",
        },
        {
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />,
          title: "Considerar Alternativas",
          message: "Podrías considerar roles que se alineen mejor con tus habilidades actuales",
          bgClass: "bg-yellow-50 dark:bg-yellow-950/30",
        },
      ]
    }
  }

  const statusMessages = getStatusMessages(data.compatibilityScore)

  // Determinar el color del círculo de progreso basado en el puntaje
  const getProgressColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-primary"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  const progressColor = getProgressColor(data.compatibilityScore)

  // Calcular el offset para la animación del círculo
  const circumference = 2 * Math.PI * 58
  const offset = circumference - (circumference * animatedScore) / 100

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
        <Button
          variant="ghost"
          className="flex items-center gap-1 hover:scale-105 transition-transform"
          onClick={onReset}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to upload
        </Button>
      </motion.div>

      <motion.div
        className="text-center mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold mb-2">Análisis de Compatibilidad</h2>
        <p className="text-muted-foreground">Así es como tu CV coincide con la descripción del trabajo</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-6 overflow-hidden">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold mb-2">Compatibilidad General</h3>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform transition-transform hover:scale-105">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className={`${progressColor} stroke-current`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                    style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                  />
                </svg>
                <span className="absolute text-2xl font-bold">{animatedScore}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {statusMessages.map((status, index) => (
                <motion.div
                  key={index}
                  className={`${status.bgClass} p-4 rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      {status.icon}
                    </motion.div>
                    <h4 className="font-medium">{status.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{status.message}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
                Habilidades Coincidentes
              </h3>
              {data.matchingSkills.length > 0 ? (
                <ul className="space-y-2">
                  {data.matchingSkills.map((skill, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-2"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No se encontraron habilidades coincidentes.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
                Habilidades Faltantes
              </h3>
              {data.missingSkills.length > 0 ? (
                <ul className="space-y-2">
                  {data.missingSkills.map((skill, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-2"
                      initial={{ x: 10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span>{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <motion.p
                  className="text-green-600 dark:text-green-500 font-medium"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  ¡Felicidades! Tienes todas las habilidades requeridas.
                </motion.p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        <Card className="transition-shadow hover:shadow-lg">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recomendaciones</h3>
            {data.recommendations.length > 0 ? (
              <ul className="space-y-3">
                {data.recommendations.map((recommendation, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="h-5 w-5 mt-0.5 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      {index + 1}
                    </div>
                    <span>{recommendation}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No hay recomendaciones específicas en este momento.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="flex justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <Button
          className="flex items-center gap-2 transition-transform hover:scale-105"
          // whileHover={{ scale: 1.05 }}
          // whileTap={{ scale: 0.95 }}
        >
          <Download className="h-4 w-4" />
          Descargar Informe Completo
        </Button>
      </motion.div>
    </div>
  )
}

