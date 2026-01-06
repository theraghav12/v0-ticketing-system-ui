"use client"

import { Inbox, MessageSquare, FileX, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  type: "no-tickets" | "no-messages" | "no-attachments" | "ticket-closed"
  onAction?: () => void
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const configs = {
    "no-tickets": {
      icon: <Inbox className="h-16 w-16 text-muted-foreground/50" />,
      title: "No support tickets yet",
      description: "Create your first ticket to get help from our support team",
      actionLabel: "Create Ticket",
    },
    "no-messages": {
      icon: <MessageSquare className="h-16 w-16 text-muted-foreground/50" />,
      title: "No messages yet",
      description: "Start the conversation by sending a message",
      actionLabel: "Send Message",
    },
    "no-attachments": {
      icon: <FileX className="h-16 w-16 text-muted-foreground/50" />,
      title: "No attachments",
      description: "Upload images, videos, or documents to help us understand your issue",
      actionLabel: "Upload Files",
    },
    "ticket-closed": {
      icon: <CheckCircle className="h-16 w-16 text-green-500/50" />,
      title: "Ticket Closed",
      description: "This ticket has been resolved and closed. You can view the conversation history above.",
      actionLabel: undefined,
    },
  }

  const config = configs[type]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">{config.icon}</div>
      <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{config.description}</p>
      {config.actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {config.actionLabel}
        </Button>
      )}
    </div>
  )
}
