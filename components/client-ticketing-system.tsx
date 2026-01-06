"use client"

import { useState } from "react"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ClientTicketInbox } from "./client-ticket-inbox"
import { ClientTicketConversation } from "./client-ticket-conversation"
import { CreateTicketModal } from "./create-ticket-modal"
import { EmptyState } from "./empty-states"
import type { Ticket, Message } from "@/lib/types"
import { mockTickets, mockMessages } from "@/lib/mock-data"

export default function ClientTicketingSystem() {
  const clientTickets = mockTickets.slice(0, 3)

  const [selectedTicketId, setSelectedTicketId] = useState<string>(clientTickets[0]?.id || "")
  const [tickets, setTickets] = useState<Ticket[]>(clientTickets)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [showCreateTicket, setShowCreateTicket] = useState(false)

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId)

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId)
  }

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ticketId: selectedTicketId,
      content,
      sender: "Client User",
      senderRole: "client",
      timestamp: new Date().toISOString(),
      isInternal: false,
      attachments: [],
    }
    setMessages([...messages, newMessage])

    setTickets(
      tickets.map((t) =>
        t.id === selectedTicketId ? { ...t, lastUpdated: new Date().toISOString(), unread: false } : t,
      ),
    )
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
          actor: "Client User",
        },
      ],
    }

    const firstMessage: Message = {
      id: `msg-${Date.now()}`,
      ticketId: newTicket.id,
      content: ticketData.description,
      sender: "Client User",
      senderRole: "client",
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
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Link href="/">
          <Button variant="outline" size="icon" className="shadow-lg bg-transparent">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Button onClick={() => setShowCreateTicket(true)} className="shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <ClientTicketInbox tickets={tickets} selectedTicketId={selectedTicketId} onTicketSelect={handleTicketSelect} />
      {selectedTicket ? (
        <ClientTicketConversation
          ticket={selectedTicket}
          messages={messages.filter((m) => m.ticketId === selectedTicketId && !m.isInternal)}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState type="no-tickets" onAction={() => setShowCreateTicket(true)} />
        </div>
      )}

      <CreateTicketModal
        isOpen={showCreateTicket}
        onClose={() => setShowCreateTicket(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  )
}
