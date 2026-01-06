"use client"

import { Users, Tag, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BulkActionsBarProps {
  selectedCount: number
  onAction: (action: string, value?: string) => void
  onClear: () => void
}

export function BulkActionsBar({ selectedCount, onAction, onClear }: BulkActionsBarProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 z-50">
      <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
        {selectedCount} selected
      </Badge>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Assign
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onAction("assign", "John Doe")}>John Doe</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("assign", "Jane Smith")}>Jane Smith</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("assign", "Mike Johnson")}>Mike Johnson</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              <Tag className="h-4 w-4 mr-2" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onAction("status", "Open")}>Open</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("status", "Closed")}>Closed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              Priority
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onAction("priority", "Low")}>Low</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("priority", "Medium")}>Medium</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("priority", "High")}>High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("priority", "Critical")}>Critical</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="secondary" size="sm" onClick={() => onAction("close")}>
          Close Tickets
        </Button>
      </div>

      <Button variant="ghost" size="sm" onClick={onClear} className="ml-2">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
