import { Hero } from "@/app/(shared)/ui/hero"
import { Features } from "@/app/(shared)/ui/features"
import { Footer } from "@/app/(site)/components/layout/footer"

export function Home() {
     return (
          <main>
               <Hero />
               <Features />
          </main>
     )
}
