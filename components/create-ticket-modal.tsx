"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, FileText, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { mockProducts, availableTags } from "@/lib/mock-data"
import type { Product, Attachment } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (ticketData: {
    productId: string
    tags: string[]
    title: string
    description: string
    attachments: Attachment[]
  }) => void
}

export function CreateTicketModal({ isOpen, onClose, onSubmit }: CreateTicketModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(Array.from(files))
    }
  }

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      // Validate file
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        return
      }

      // Simulate upload
      const fileId = `file-${Date.now()}-${Math.random()}`
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[fileId] || 0
          if (current >= 100) {
            clearInterval(interval)
            return prev
          }
          return { ...prev, [fileId]: Math.min(current + 10, 100) }
        })
      }, 100)

      // Add to attachments after "upload"
      setTimeout(() => {
        const attachment: Attachment = {
          id: fileId,
          name: file.name,
          type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
          url: URL.createObjectURL(file),
          size: file.size,
          uploadedAt: new Date().toISOString(),
        }
        setAttachments((prev) => [...prev, attachment])
        setUploadProgress((prev) => {
          const { [fileId]: _, ...rest } = prev
          return rest
        })
      }, 1200)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSubmit = () => {
    if (!selectedProduct || !title.trim() || !description.trim()) {
      alert("Please fill in all required fields")
      return
    }

    onSubmit({
      productId: selectedProduct.id,
      tags: selectedTags,
      title,
      description,
      attachments,
    })

    // Reset form
    setSelectedProduct(null)
    setSelectedTags([])
    setTitle("")
    setDescription("")
    setAttachments([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Select Product *</Label>
            <div className="grid grid-cols-2 gap-3">
              {mockProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={cn(
                    "flex items-start gap-3 p-4 border-2 rounded-lg text-left transition-all hover:border-primary/50",
                    selectedProduct?.id === product.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/50",
                  )}
                >
                  <span className="text-2xl flex-shrink-0">{product.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{product.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Issue Tags */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Issue Category (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-semibold mb-2 block">
              Issue Title *
            </Label>
            <Input
              id="title"
              placeholder="Brief description of your issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1">{title.length}/100 characters</p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-base font-semibold mb-2 block">
              Issue Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide detailed information about your issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Attachments */}
          <div>
            <Label className="text-base font-semibold mb-2 block">Attachments (Optional)</Label>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-border",
              )}
            >
              <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Drag and drop files here, or click to browse</p>
              <p className="text-xs text-muted-foreground mb-4">Images, videos, and documents up to 10MB each</p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              />
              <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                Browse Files
              </Button>
            </div>

            {/* Upload Progress */}
            {Object.keys(uploadProgress).length > 0 && (
              <div className="mt-4 space-y-2">
                {Object.entries(uploadProgress).map(([id, progress]) => (
                  <div key={id} className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12">{progress}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Attachment Previews */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {attachment.type === "image" && <ImageIcon className="h-5 w-5 text-blue-500" />}
                      {attachment.type === "video" && <Video className="h-5 w-5 text-purple-500" />}
                      {attachment.type === "document" && <FileText className="h-5 w-5 text-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{attachment.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create Ticket</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
