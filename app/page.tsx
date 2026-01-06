import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, User } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20 p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">FoodBot CRM</h1>
        <p className="text-muted-foreground text-lg">Ticketing System</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/admin" className="group">
          <div className="border-2 border-border hover:border-primary transition-colors rounded-lg p-8 text-center bg-card hover:shadow-lg">
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Admin Portal</h2>
            <p className="text-muted-foreground mb-6">
              Access the full CS team dashboard with internal notes, bulk actions, and ticket management
            </p>
            <Button className="w-full">Enter Admin Portal</Button>
          </div>
        </Link>

        <Link href="/client" className="group">
          <div className="border-2 border-border hover:border-primary transition-colors rounded-lg p-8 text-center bg-card hover:shadow-lg">
            <User className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Client Portal</h2>
            <p className="text-muted-foreground mb-6">
              View and manage your support tickets with direct communication to our team
            </p>
            <Button className="w-full">Enter Client Portal</Button>
          </div>
        </Link>
      </div>
    </div>
  )
}
