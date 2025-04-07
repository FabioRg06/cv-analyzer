"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Star, Github, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface GitHubStarButtonProps {
  repoUrl: string
  className?: string
}

export function GitHubStarButton({ repoUrl, className }: GitHubStarButtonProps) {
  const [starCount, setStarCount] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Extract username and repo name from URL
  const getRepoDetails = () => {
    try {
      const url = new URL(repoUrl)
      const pathParts = url.pathname.split("/").filter(Boolean)
      if (pathParts.length >= 2) {
        return {
          username: pathParts[0],
          repo: pathParts[1],
        }
      }
    } catch (e) {
      console.error("Invalid GitHub URL", e)
    }
    return null
  }

  // Fetch star count from GitHub API
  useEffect(() => {
    const fetchStarCount = async () => {
      const repoDetails = getRepoDetails()
      if (!repoDetails) return

      try {
        const response = await fetch(`https://api.github.com/repos/${repoDetails.username}/${repoDetails.repo}`)
        if (response.ok) {
          const data = await response.json()
          setStarCount(data.stargazers_count)
        }
      } catch (error) {
        console.error("Error fetching GitHub stars:", error)
      }
    }

    fetchStarCount()
  }, [repoUrl])

  const handleClick = () => {
    // Open GitHub repo in a new tab
    window.open(repoUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Button
        variant="outline"
        className="flex items-center gap-2 border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-400 group"
        onClick={handleClick}
      >
        <motion.div animate={isHovering ? { rotate: [0, -15, 15, -10, 10, 0] } : {}} transition={{ duration: 0.5 }}>
          <Star className="h-4 w-4 text-yellow-500 group-hover:fill-yellow-500 transition-all duration-300" />
        </motion.div>
        <span className="flex items-center gap-1">
          <span>Star on</span>
          <Github className="h-4 w-4 inline-block" />
          <span>GitHub</span>
          {starCount !== null && (
            <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
              {starCount}
            </span>
          )}
        </span>
        <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
      </Button>
    </motion.div>
  )
}

