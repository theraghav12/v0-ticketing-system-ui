"use client"

import { useState } from "react"
import { Search, Filter, CheckSquare, Square } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Ticket, UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TicketInboxProps {
  tickets: Ticket[]
  selectedTicketId: string
  selectedTickets: string[]
  onTicketSelect: (ticketId: string) => void
  onTicketsSelect: (ticketIds: string[]) => void
  userRole: UserRole
}

export function TicketInbox({
  tickets,
  selectedTicketId,
  selectedTickets,
  onTicketSelect,
  onTicketsSelect,
  userRole,
}: TicketInboxProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    status: [] as string[],
    clientStatus: [] as string[],
    priority: [] as string[],
  })

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.restaurant.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filters.status.length === 0 || filters.status.includes(ticket.status)
    const matchesClientStatus = filters.clientStatus.length === 0 || filters.clientStatus.includes(ticket.clientStatus)
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(ticket.priority)

    return matchesSearch && matchesStatus && matchesClientStatus && matchesPriority
  })

  const handleToggleTicket = (ticketId: string) => {
    if (selectedTickets.includes(ticketId)) {
      onTicketsSelect(selectedTickets.filter((id) => id !== ticketId))
    } else {
      onTicketsSelect([...selectedTickets, ticketId])
    }
  }

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      onTicketsSelect([])
    } else {
      onTicketsSelect(filteredTickets.map((t) => t.id))
    }
  }

  return (
    <div className="w-[30%] min-w-[350px] border-r border-border flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Support Tickets</h1>
          {userRole === "cs" && (
            <Button variant="ghost" size="sm" onClick={handleSelectAll} className="h-8 w-8 p-0">
              {selectedTickets.length === filteredTickets.length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {filters.status.length + filters.clientStatus.length + filters.priority.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.status.length + filters.clientStatus.length + filters.priority.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="space-y-2">
                  {["Open", "Closed"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={(checked) => {
                          setFilters((prev) => ({
                            ...prev,
                            status: checked ? [...prev.status, status] : prev.status.filter((s) => s !== status),
                          }))
                        }}
                      />
                      <Label htmlFor={`status-${status}`}>{status}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Client Status</h4>
                <div className="space-y-2">
                  {["Open Response Pending", "Troubleshooting", "Awaiting Client", "Resolved"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`client-${status}`}
                        checked={filters.clientStatus.includes(status)}
                        onCheckedChange={(checked) => {
                          setFilters((prev) => ({
                            ...prev,
                            clientStatus: checked
                              ? [...prev.clientStatus, status]
                              : prev.clientStatus.filter((s) => s !== status),
                          }))
                        }}
                      />
                      <Label htmlFor={`client-${status}`} className="text-sm">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Priority</h4>
                <div className="space-y-2">
                  {["Low", "Medium", "High", "Critical"].map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${priority}`}
                        checked={filters.priority.includes(priority)}
                        onCheckedChange={(checked) => {
                          setFilters((prev) => ({
                            ...prev,
                            priority: checked
                              ? [...prev.priority, priority]
                              : prev.priority.filter((p) => p !== priority),
                          }))
                        }}
                      />
                      <Label htmlFor={`priority-${priority}`}>{priority}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Ticket List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={cn(
                "p-4 cursor-pointer hover:bg-accent/50 transition-colors relative",
                selectedTicketId === ticket.id && "bg-accent",
                ticket.unread && "font-semibold",
              )}
              onClick={() => onTicketSelect(ticket.id)}
            >
              {userRole === "cs" && (
                <div
                  className="absolute left-2 top-4"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleTicket(ticket.id)
                  }}
                >
                  <Checkbox checked={selectedTickets.includes(ticket.id)} />
                </div>
              )}

              <div className={cn("space-y-2", userRole === "cs" && "ml-6")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono text-muted-foreground">{ticket.code}</span>
                      {ticket.unread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <h3 className="text-sm truncate mt-1">{ticket.subject}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {ticket.product}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      ticket.status === "Open" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                      ticket.status === "Closed" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                    )}
                  >
                    {ticket.status}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      ticket.clientStatus === "Awaiting Client" &&
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                      ticket.clientStatus === "Troubleshooting" &&
                        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                      ticket.clientStatus === "Resolved" &&
                        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                      ticket.clientStatus === "Open Response Pending" &&
                        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                    )}
                  >
                    {ticket.clientStatus}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{ticket.restaurant}</span>
                  <span>{new Date(ticket.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
