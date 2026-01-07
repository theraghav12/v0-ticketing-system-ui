"use client"

import { useState } from "react"
import { Send, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TicketTimeline } from "./ticket-timeline"
import { MessageBubble } from "./message-bubble"
import type { Ticket, Message } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ClientTicketConversationProps {
  ticket: Ticket
  messages: Message[]
  onSendMessage: (content: string) => void
}

export function ClientTicketConversation({ ticket, messages, onSendMessage }: ClientTicketConversationProps) {
  const [messageContent, setMessageContent] = useState("")
  const [showTimeline, setShowTimeline] = useState(false)
  const [replyingTo, setReplyingTo] = useState<{ id: string; content: string } | null>(null)

  const handleSend = () => {
    if (!messageContent.trim()) return
    onSendMessage(messageContent)
    setMessageContent("")
    setReplyingTo(null)
  }

  const handleReply = (messageId: string, content: string) => {
    setReplyingTo({ id: messageId, content })
    const input = document.querySelector("textarea") as HTMLTextAreaElement
    input?.focus()
  }

  const handleReaction = (messageId: string, emoji: string) => {
    console.log(`[v0] Client reacted to message ${messageId} with ${emoji}`)
  }

  const getStatusColor = (clientStatus: string) => {
    const statusMap: Record<string, string> = {
      "Open Response Pending": "bg-orange-500/10 text-orange-600 border-orange-500/20",
      "Client Responded": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      Resolved: "bg-green-500/10 text-green-600 border-green-500/20",
      Closed: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    }
    return statusMap[clientStatus] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
  }

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 bg-background">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm text-muted-foreground">{ticket.code}</span>
                <Badge variant="outline" className={cn("text-xs", getStatusColor(ticket.clientStatus))}>
                  {ticket.clientStatus}
                </Badge>
              </div>
              <h2 className="text-lg font-semibold mb-1">{ticket.subject}</h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{ticket.restaurant}</span>
                <span>•</span>
                <span>{ticket.product}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowTimeline(!showTimeline)}>
              {showTimeline ? "Hide" : "Show"} Timeline
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderRole === "client"}
                onReply={handleReply}
                onReaction={handleReaction}
                currentUser="Client"
              />
            ))}
          </div>
        </ScrollArea>

        <Separator />

        {/* Message Input */}
        <div className="p-4 bg-background">
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
            <Button variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Textarea
              placeholder="Type your message..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="min-h-[60px] max-h-[200px] resize-none"
            />
            <Button onClick={handleSend} disabled={!messageContent.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>

      {showTimeline && (
        <div className="w-80 border-l border-border bg-muted/30">
          <TicketTimeline timeline={ticket.timeline || []} />
        </div>
      )}
    </div>
  )
}
