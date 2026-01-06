"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, CheckCircle2 } from "lucide-react"
import type { Ticket, UserRole } from "@/lib/types"

interface ClosureSummaryProps {
  ticket: Ticket
  userRole: UserRole
}

export function ClosureSummary({ ticket, userRole }: ClosureSummaryProps) {
  if (!ticket.closureSummary) return null

  return (
    <div className="space-y-4">
      {/* Client-Facing Summary */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Resolution Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{ticket.closureSummary.clientSummary}</p>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t text-xs text-muted-foreground">
            <span>Closed on {new Date(ticket.closureSummary.closedAt).toLocaleString()}</span>
            <span>•</span>
            <span>by {ticket.closureSummary.closedBy}</span>
          </div>
        </CardContent>
      </Card>

      {/* Internal Summary (CS Only) */}
      {userRole === "cs" && (
        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-orange-500" />
              Internal Issue Summary
              <Badge variant="secondary" className="text-xs">
                CS Only
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{ticket.closureSummary.internalSummary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
