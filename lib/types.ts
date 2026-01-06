export type UserRole = "client" | "cs" | "system"

export interface Ticket {
  id: string
  code: string
  subject: string
  restaurant: string
  product: string
  status: "Open" | "Closed"
  clientStatus: "Open Response Pending" | "Troubleshooting" | "Awaiting Client" | "Resolved"
  priority: "Low" | "Medium" | "High" | "Critical"
  assignedTo: string
  lastUpdated: string
  unread: boolean
  createdViaEmail: boolean
  tags?: string[]
  timeline?: TimelineEvent[]
  closureSummary?: {
    clientSummary: string
    internalSummary: string
    closedAt: string
    closedBy: string
  }
}

export interface Message {
  id: string
  ticketId: string
  content: string
  sender: string
  senderRole: UserRole
  timestamp: string
  isInternal: boolean
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  type: "image" | "video" | "document"
  url: string
  size: number
  uploadedAt: string
}

export interface TimelineEvent {
  id: string
  type: "created" | "assigned" | "status_changed" | "transferred" | "resolved" | "closed"
  description: string
  timestamp: string
  actor: string
  metadata?: Record<string, string>
}

export interface Product {
  id: string
  name: string
  description: string
  icon: string
}
