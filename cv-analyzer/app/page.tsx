import { Uploader } from "@/components/uploader"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="text-center mb-10">
            <div className="inline-block mb-4 p-2 bg-primary/10 rounded-full">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-primary"
                >
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
                  <path d="M9 9h1" />
                  <path d="M9 13h6" />
                  <path d="M9 17h6" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              CV Compatibility Analyzer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
             Upload your CV and a job description to see how compatible you are for the position
            </p>
          </div>
          <Uploader />
        </div>
      </main>
      <Toaster />
    </div>
  )
}

