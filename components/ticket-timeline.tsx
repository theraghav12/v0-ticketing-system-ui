"use client"

import { CheckCircle2, Clock, UserCheck, ArrowRightLeft, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TimelineEvent, UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TicketTimelineProps {
  timeline: TimelineEvent[]
  userRole: UserRole
}

export function TicketTimeline({ timeline, userRole }: TicketTimelineProps) {
  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "created":
        return <Clock className="h-4 w-4" />
      case "assigned":
        return <UserCheck className="h-4 w-4" />
      case "status_changed":
        return <Clock className="h-4 w-4" />
      case "transferred":
        return <ArrowRightLeft className="h-4 w-4" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getIconColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "created":
        return "text-blue-500"
      case "assigned":
        return "text-purple-500"
      case "status_changed":
        return "text-yellow-500"
      case "transferred":
        return "text-orange-500"
      case "resolved":
        return "text-green-500"
      case "closed":
        return "text-gray-500"
      default:
        return "text-gray-500"
    }
  }

  // Filter internal events for client users
  const visibleTimeline = userRole === "client" ? timeline.filter((event) => event.type !== "transferred") : timeline

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ticket Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleTimeline.map((event, index) => (
            <div key={event.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={cn("p-2 rounded-full bg-muted", getIconColor(event.type))}>{getIcon(event.type)}</div>
                {index < visibleTimeline.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm font-medium">{event.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {userRole === "cs" && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">{event.actor}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {visibleTimeline.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">No timeline events yet</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
