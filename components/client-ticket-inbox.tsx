"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Ticket } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ClientTicketInboxProps {
  tickets: Ticket[]
  selectedTicketId: string
  onTicketSelect: (ticketId: string) => void
}

export function ClientTicketInbox({ tickets, selectedTicketId, onTicketSelect }: ClientTicketInboxProps) {
  const getStatusColor = (clientStatus: string) => {
    const statusMap: Record<string, string> = {
      "Open Response Pending": "bg-orange-500/10 text-orange-600 border-orange-500/20",
      "Client Responded": "bg-blue-500/10 text-blue-600 border-orange-500/20",
      Resolved: "bg-green-500/10 text-green-600 border-green-500/20",
      Closed: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    }
    return statusMap[clientStatus] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="w-[30%] border-r border-border flex flex-col bg-muted/30 pt-16">
      <div className="p-4 space-y-3 border-b border-border bg-background">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Response Pending</SelectItem>
            <SelectItem value="responded">I Responded</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => onTicketSelect(ticket.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg mb-2 transition-colors hover:bg-accent/50",
                selectedTicketId === ticket.id && "bg-accent shadow-sm",
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{ticket.code}</span>
                    {ticket.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1">{ticket.subject}</h3>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(ticket.lastUpdated)}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={cn("text-xs", getStatusColor(ticket.clientStatus))}>
                  {ticket.clientStatus}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {ticket.product}
                </Badge>
              </div>

              {ticket.tags && ticket.tags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {ticket.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {ticket.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{ticket.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
