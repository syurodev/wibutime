"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function UserProfile() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Not authenticated</div>
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
          <AvatarFallback className="text-lg">
            {session.user?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <CardTitle>{session.user?.name || "Unknown User"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Badge variant="secondary">{session.user?.email}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          User ID: {session.user?.id || "N/A"}
        </div>
      </CardContent>
    </Card>
  )
}