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
  const data = analysisData
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

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="flex items-center gap-1" onClick={onReset}>
        <ArrowLeft className="h-4 w-4" />
        Back to upload
      </Button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Análisis de Compatibilidad</h2>
        <p className="text-muted-foreground">Así es como tu CV coincide con la descripción del trabajo</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Compatibilidad General</h3>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32">
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
                  strokeDasharray={365}
                  strokeDashoffset={365 - (365 * data.compatibilityScore) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
              </svg>
              <span className="absolute text-2xl font-bold">{data.compatibilityScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {statusMessages.map((status, index) => (
              <div key={index} className={`${status.bgClass} p-4 rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  {status.icon}
                  <h4 className="font-medium">{status.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{status.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
              Habilidades Coincidentes
            </h3>
            {data.matchingSkills.length > 0 ? (
              <ul className="space-y-2">
                {data.matchingSkills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No se encontraron habilidades coincidentes.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
              Habilidades Faltantes
            </h3>
            {data.missingSkills.length > 0 ? (
              <ul className="space-y-2">
                {data.missingSkills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-600 dark:text-green-500 font-medium">
                ¡Felicidades! Tienes todas las habilidades requeridas.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Recomendaciones</h3>
          {data.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {data.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-5 w-5 mt-0.5 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    {index + 1}
                  </div>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No hay recomendaciones específicas en este momento.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Descargar Informe Completo
        </Button>
      </div>
    </div>
  )
}

