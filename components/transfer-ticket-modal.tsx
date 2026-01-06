"use client"

import { useState } from "react"
import { ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TransferTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onTransfer: (data: { team: string; user: string; note: string }) => void
  currentAssignee: string
}

const teams = [
  { id: "cs", name: "Customer Success" },
  { id: "tech", name: "Technical Support" },
]

const csUsers = [
  { id: "john", name: "John Doe" },
  { id: "jane", name: "Jane Smith" },
  { id: "mike", name: "Mike Johnson" },
]

const techUsers = [
  { id: "alex", name: "Alex Chen" },
  { id: "sarah", name: "Sarah Wilson" },
  { id: "david", name: "David Martinez" },
]

export function TransferTicketModal({ isOpen, onClose, onTransfer, currentAssignee }: TransferTicketModalProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("")
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [internalNote, setInternalNote] = useState("")

  const availableUsers = selectedTeam === "cs" ? csUsers : selectedTeam === "tech" ? techUsers : []

  const handleTransfer = () => {
    if (!selectedTeam || !selectedUser || !internalNote.trim()) {
      alert("Please fill in all required fields")
      return
    }

    onTransfer({
      team: selectedTeam,
      user: selectedUser,
      note: internalNote,
    })

    // Reset form
    setSelectedTeam("")
    setSelectedUser("")
    setInternalNote("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Transfer Ticket
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Currently assigned to:</p>
            <p className="text-sm font-semibold">{currentAssignee}</p>
          </div>

          <div>
            <Label htmlFor="team">Transfer to Team *</Label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger id="team" className="mt-2">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTeam && (
            <div>
              <Label htmlFor="user">Assign to User *</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user" className="mt-2">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="note">Internal Transfer Note *</Label>
            <Textarea
              id="note"
              placeholder="Provide context for the new assignee (internal only)..."
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-1">This note is only visible to CS/Tech teams</p>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleTransfer}>Transfer Ticket</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
