"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TicketInbox } from "./ticket-inbox"
import { TicketConversation } from "./ticket-conversation"
import { BulkActionsBar } from "./bulk-actions-bar"
import { CreateTicketModal } from "./create-ticket-modal"
import { EmptyState } from "./empty-states"
import type { Ticket, Message, UserRole } from "@/lib/types"
import { mockTickets, mockMessages } from "@/lib/mock-data"

export default function TicketingSystem() {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(mockTickets[0]?.id || "")
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [userRole] = useState<UserRole>("cs") // 'client' or 'cs'
  const [showInternalNotes, setShowInternalNotes] = useState(false)
  const [showCreateTicket, setShowCreateTicket] = useState(false)

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId)

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setSelectedTickets([])
  }

  const handleSendMessage = (content: string, isInternal: boolean) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ticketId: selectedTicketId,
      content,
      sender: userRole === "cs" ? "John Doe (CS)" : "Client User",
      senderRole: userRole,
      timestamp: new Date().toISOString(),
      isInternal,
      attachments: [],
    }
    setMessages([...messages, newMessage])

    // Update ticket's lastUpdated
    setTickets(
      tickets.map((t) =>
        t.id === selectedTicketId ? { ...t, lastUpdated: new Date().toISOString(), unread: false } : t,
      ),
    )
  }

  const handleUpdateTicket = (updates: Partial<Ticket>) => {
    setTickets(tickets.map((t) => (t.id === selectedTicketId ? { ...t, ...updates } : t)))
  }

  const handleBulkAction = (action: string, value?: string) => {
    console.log("[v0] Bulk action:", action, value, selectedTickets)
    // Handle bulk actions here
    setSelectedTickets([])
  }

  const handleCreateTicket = (ticketData: {
    productId: string
    tags: string[]
    title: string
    description: string
    attachments: any[]
  }) => {
    const newTicketCode = `FBT-2025-${String(tickets.length + 100).padStart(5, "0")}`
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      code: newTicketCode,
      subject: ticketData.title,
      restaurant: "Your Restaurant",
      product: ticketData.productId,
      status: "Open",
      clientStatus: "Open Response Pending",
      priority: "Medium",
      assignedTo: "Unassigned",
      lastUpdated: new Date().toISOString(),
      unread: true,
      createdViaEmail: false,
      tags: ticketData.tags,
      timeline: [
        {
          id: `timeline-${Date.now()}`,
          type: "created",
          description: "Ticket created",
          timestamp: new Date().toISOString(),
          actor: userRole === "cs" ? "John Doe (CS)" : "Client User",
        },
      ],
    }

    const firstMessage: Message = {
      id: `msg-${Date.now()}`,
      ticketId: newTicket.id,
      content: ticketData.description,
      sender: userRole === "cs" ? "John Doe (CS)" : "Client User",
      senderRole: userRole,
      timestamp: new Date().toISOString(),
      isInternal: false,
      attachments: ticketData.attachments,
    }

    setTickets([newTicket, ...tickets])
    setMessages([...messages, firstMessage])
    setSelectedTicketId(newTicket.id)
    setShowCreateTicket(false)
  }

  return (
    <div className="flex h-screen bg-background relative">
      <div className="absolute top-4 left-4 z-10">
        <Button onClick={() => setShowCreateTicket(true)} className="shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      <TicketInbox
        tickets={tickets}
        selectedTicketId={selectedTicketId}
        selectedTickets={selectedTickets}
        onTicketSelect={handleTicketSelect}
        onTicketsSelect={setSelectedTickets}
        userRole={userRole}
      />
      {selectedTicket ? (
        <TicketConversation
          ticket={selectedTicket}
          messages={messages.filter((m) => m.ticketId === selectedTicketId)}
          onSendMessage={handleSendMessage}
          onUpdateTicket={handleUpdateTicket}
          userRole={userRole}
          showInternalNotes={showInternalNotes}
          onToggleInternalNotes={() => setShowInternalNotes(!showInternalNotes)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState type="no-tickets" onAction={() => setShowCreateTicket(true)} />
        </div>
      )}
      {selectedTickets.length > 0 && userRole === "cs" && (
        <BulkActionsBar
          selectedCount={selectedTickets.length}
          onAction={handleBulkAction}
          onClear={() => setSelectedTickets([])}
        />
      )}

      <CreateTicketModal
        isOpen={showCreateTicket}
        onClose={() => setShowCreateTicket(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  )
}
