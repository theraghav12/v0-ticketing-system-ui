"use client"

import type React from "react"

import { useState } from "react"
import { MoreVertical, Send, Paperclip, Smile, Lock, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransferTicketModal } from "./transfer-ticket-modal"
import { TicketTimeline } from "./ticket-timeline"
import { ClosureSummary } from "./closure-summary"
import { EmptyState } from "./empty-states"
import { MessageBubble } from "./message-bubble"
import type { Ticket, Message, UserRole } from "@/lib/types"

interface TicketConversationProps {
  ticket: Ticket
  messages: Message[]
  onSendMessage: (content: string, isInternal: boolean) => void
  onUpdateTicket: (updates: Partial<Ticket>) => void
  userRole: UserRole
  showInternalNotes: boolean
  onToggleInternalNotes: () => void
}

export function TicketConversation({
  ticket,
  messages,
  onSendMessage,
  onUpdateTicket,
  userRole,
  showInternalNotes,
  onToggleInternalNotes,
}: TicketConversationProps) {
  const [messageInput, setMessageInput] = useState("")
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [replyingTo, setReplyingTo] = useState<{ id: string; content: string } | null>(null)

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput, showInternalNotes)
      setMessageInput("")
      setReplyingTo(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTransfer = (data: { team: string; user: string; note: string }) => {
    console.log("[v0] Transferring ticket:", data)
    onUpdateTicket({ assignedTo: data.user })
  }

  const handleReply = (messageId: string, content: string) => {
    setReplyingTo({ id: messageId, content })
    // Focus input
    const input = document.querySelector("textarea") as HTMLTextAreaElement
    input?.focus()
  }

  const handleReaction = (messageId: string, emoji: string) => {
    console.log(`[v0] User reacted to message ${messageId} with ${emoji}`)
    // In a real app, this would update the message in the backend
  }

  const displayMessages = showInternalNotes
    ? messages.filter((m) => m.isInternal)
    : messages.filter((m) => !m.isInternal)

  const isClosed = ticket.status === "Closed"

  return (
    <div className="flex-1 flex bg-background">
      {/* Main Conversation Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{ticket.code}</h2>
                {ticket.priority === "Critical" && (
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Critical</Badge>
                )}
                {ticket.tags && ticket.tags.length > 0 && (
                  <div className="flex gap-1">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{ticket.subject}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {userRole === "cs" && (
                  <>
                    <DropdownMenuItem onClick={() => setShowTransferModal(true)}>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Transfer Ticket
                    </DropdownMenuItem>
                    <DropdownMenuItem>Archive Ticket</DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem>Close Ticket</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select
                value={ticket.status}
                onValueChange={(value) => onUpdateTicket({ status: value as "Open" | "Closed" })}
                disabled={userRole === "client"}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Client Status:</span>
              <Select
                value={ticket.clientStatus}
                onValueChange={(value) => onUpdateTicket({ clientStatus: value })}
                disabled={userRole === "client"}
              >
                <SelectTrigger className="w-48 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open Response Pending">Open Response Pending</SelectItem>
                  <SelectItem value="Troubleshooting">Troubleshooting</SelectItem>
                  <SelectItem value="Awaiting Client">Awaiting Client</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Priority:</span>
              <Select
                value={ticket.priority}
                onValueChange={(value) => onUpdateTicket({ priority: value })}
                disabled={userRole === "client"}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {userRole === "cs" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Assigned:</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ticket.assignedTo}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Type Toggle (CS Only) */}
        {userRole === "cs" && !isClosed && (
          <div className="px-4 pt-3 bg-card">
            <Tabs value={showInternalNotes ? "internal" : "client"} onValueChange={(v) => onToggleInternalNotes()}>
              <TabsList>
                <TabsTrigger value="client">Client Messages</TabsTrigger>
                <TabsTrigger value="internal" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Internal Notes
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {isClosed && ticket.closureSummary && (
          <div className="p-4 bg-card">
            <ClosureSummary ticket={ticket} userRole={userRole} />
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {displayMessages.map((message) => {
              const isSystem = message.senderRole === "system"
              const isOwn = userRole === message.senderRole

              if (isSystem) {
                return (
                  <div key={message.id} className="flex justify-center">
                    <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {message.content}
                    </div>
                  </div>
                )
              }

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  onReply={handleReply}
                  onReaction={handleReaction}
                  currentUser={userRole === "cs" ? "John Doe (CS)" : "Client"}
                />
              )
            })}

            {displayMessages.length === 0 && !isClosed && (
              <EmptyState type={showInternalNotes ? "no-messages" : "no-messages"} />
            )}

            {isClosed && displayMessages.length === 0 && <EmptyState type="ticket-closed" />}
          </div>
        </ScrollArea>

        {/* Input Area */}
        {!isClosed && (
          <div className="p-4 border-t border-border bg-card">
            <div className="max-w-4xl mx-auto">
              {showInternalNotes && userRole === "cs" && (
                <div className="mb-2 flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                  <Lock className="h-4 w-4" />
                  <span>Internal note - only visible to CS team</span>
                </div>
              )}

              {/* Reply Preview */}
              {replyingTo && (
                <div className="mb-3 p-3 bg-muted rounded border border-border flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Replying to:</p>
                    <p className="text-sm truncate">{replyingTo.content}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="ml-2 flex-shrink-0">
                    ✕
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder={showInternalNotes ? "Write an internal note..." : "Type your message..."}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[80px] resize-none pr-20"
                  />
                  <div className="absolute right-2 bottom-2 flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={handleSend} className="self-end">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
        {ticket.timeline && <TicketTimeline timeline={ticket.timeline} userRole={userRole} />}
      </div>

      <TransferTicketModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransfer={handleTransfer}
        currentAssignee={ticket.assignedTo}
      />
    </div>
  )
}
