"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileText, ImageIcon, Video, FileCode as SmileMore, Reply as Reply2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Message } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  onReply: (messageId: string, content: string) => void
  onReaction: (messageId: string, emoji: string) => void
  currentUser: string
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🚀", "✨"]

export function MessageBubble({ message, isOwn, onReply, onReaction, currentUser }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const messageRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setTranslateX(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX
    const diff = currentX - startX

    // Only allow swipe in the direction away from the message (left for own, right for others)
    if ((isOwn && diff < 0) || (!isOwn && diff > 0)) {
      setTranslateX(Math.abs(diff) > 100 ? (isOwn ? -80 : 80) : diff * 0.3)
    }
  }

  const handleTouchEnd = () => {
    if (Math.abs(translateX) > 60) {
      onReply(message.id, message.content)
      setTranslateX(0)
    } else {
      setTranslateX(0)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getAttachmentIcon = (type: string) => {
    if (type === "image") return <ImageIcon className="h-4 w-4 text-blue-500" />
    if (type === "video") return <Video className="h-4 w-4 text-purple-500" />
    return <FileText className="h-4 w-4 text-orange-500" />
  }

  const isSystem = message.senderRole === "system"

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{message.content}</div>
      </div>
    )
  }

  return (
    <div className={cn("flex gap-3 group py-1", isOwn ? "flex-row-reverse" : "flex-row")} ref={messageRef}>
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
        <AvatarImage src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback>
          {message.sender
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col gap-1 flex-1", isOwn ? "items-end" : "items-start")}>
        {/* Reply Preview */}
        {message.replyToId && (
          <div
            className={cn(
              "text-xs px-3 py-2 rounded mb-1 border-l-2 max-w-xs",
              "bg-muted/50 border-muted-foreground/20 text-muted-foreground",
            )}
          >
            <div className="font-medium mb-1">Replying to:</div>
            <div className="line-clamp-2 italic">{message.replyToContent}</div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{message.sender}</span>
          <span>•</span>
          <span>{formatTimestamp(message.timestamp)}</span>
        </div>

        {/* Message Container */}
        <div
          className="flex gap-2 items-start"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: translateX === 0 ? "transform 0.2s ease-out" : "none",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe Action Indicator */}
          <div
            className={cn(
              "flex items-center gap-1 text-muted-foreground opacity-0 transition-opacity",
              Math.abs(translateX) > 40 && "opacity-100",
              isOwn ? "flex-row-reverse" : "flex-row",
            )}
          >
            <Reply2 className="h-4 w-4" />
            <span className="text-xs">Reply</span>
          </div>

          <div
            className={cn(
              "rounded-lg px-4 py-2 max-w-xl",
              isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
              message.replyToId && "border border-muted-foreground/10",
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded border text-sm",
                      isOwn ? "bg-primary-foreground/10 border-primary-foreground/20" : "bg-background border-border",
                    )}
                  >
                    {getAttachmentIcon(attachment.type)}
                    <span className="flex-1 truncate">{attachment.name}</span>
                    <span className="text-xs opacity-70">{(attachment.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onReply(message.id, message.content)}
            >
              <Reply2 className="h-3.5 w-3.5" />
            </Button>

            <DropdownMenu open={showReactions} onOpenChange={setShowReactions}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <SmileMore className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwn ? "end" : "start"} className="w-56">
                <div className="p-2 grid grid-cols-4 gap-2">
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      className="text-2xl p-2 rounded hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => {
                        onReaction(message.id, emoji)
                        setShowReactions(false)
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Reactions Display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {message.reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                className={cn(
                  "px-2 py-1 rounded-full text-sm border transition-colors hover:bg-muted/50",
                  reaction.users.includes(currentUser)
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-muted border-border text-muted-foreground",
                )}
                onClick={() => onReaction(message.id, reaction.emoji)}
              >
                {reaction.emoji} {reaction.count > 1 && reaction.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
