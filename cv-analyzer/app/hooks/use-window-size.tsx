"use client"

import { useState, useEffect } from "react"

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    // Llamar al handler inmediatamente para que el estado
    // refleje el tamaño inicial de la ventana
    handleResize()

    // Limpiar el event listener al desmontar
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

