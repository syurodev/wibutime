"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import {
  passkeyCredentialsAction,
  passkeyDeleteCredentialAction,
  passkeyRegisterBeginAction,
  passkeyRegisterCompleteAction,
  type PasskeyCredential,
} from "@/features/auth/actions/passkey.actions"
import {
  encodeCredential,
  normalizeCreationOptions,
  type PublicKeyCredentialCreationOptionsJSON,
} from "@/features/auth/lib/passkey-client"

export function PasskeyLab() {
  const [friendlyName, setFriendlyName] = useState("This device")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [items, setItems] = useState<PasskeyCredential[]>([])
  const [canUsePasskey, setCanUsePasskey] = useState(false)

  const refresh = async () => {
    setIsLoadingList(true)
    try {
      const data = await passkeyCredentialsAction()
      setItems(data)
    } catch (e: any) {
      toast.error(e.message || "Failed to load passkeys")
    } finally {
      setIsLoadingList(false)
    }
  }

  useEffect(() => {
    setCanUsePasskey(typeof window !== "undefined" && "credentials" in navigator)
    refresh().catch(() => {})
  }, [])

  const onRegister = async () => {
    setIsRegistering(true)
    try {
      if (!canUsePasskey) {
        throw new Error("Passkey is not supported on this device/browser")
      }

      const begin = await passkeyRegisterBeginAction({
        friendly_name: friendlyName.trim(),
      })

      const publicKey = normalizeCreationOptions(
        begin.options as unknown as PublicKeyCredentialCreationOptionsJSON
      )

      const credential = (await navigator.credentials.create({
        publicKey,
      })) as PublicKeyCredential | null

      if (!credential) {
        throw new Error("No credential returned")
      }

      await passkeyRegisterCompleteAction({
        credential: encodeCredential(credential, true),
      })

      toast.success("Passkey registered")
      await refresh()
    } catch (e: any) {
      toast.error(e.message || "Failed to register passkey")
    } finally {
      setIsRegistering(false)
    }
  }

  const onDelete = async (id: string) => {
    try {
      await passkeyDeleteCredentialAction(id)
      toast.success("Passkey deleted")
      await refresh()
    } catch (e: any) {
      toast.error(e.message || "Failed to delete passkey")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Passkey (Lab)</CardTitle>
          <CardDescription>
            Register and manage passkeys for testing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-disabled={isRegistering}>
              <FieldLabel htmlFor="friendly_name">Friendly name</FieldLabel>
              <Input
                id="friendly_name"
                value={friendlyName}
                onChange={(e) => setFriendlyName(e.target.value)}
                disabled={isRegistering}
              />
              <FieldDescription>
                Example: “iPhone 16”, “MacBook”, “YubiKey”.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <Button onClick={onRegister} disabled={isRegistering}>
            {isRegistering ? "Registering..." : "Register Passkey"}
          </Button>
          {!canUsePasskey && (
            <p className="text-sm text-muted-foreground">
              Passkey not supported on this browser/device.
            </p>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your passkeys</CardTitle>
          <CardDescription>
            {isLoadingList ? "Loading..." : `${items.length} passkey(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No passkeys yet. Register one above.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {it.friendly_name}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      id: {it.id}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => onDelete(it.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => refresh()}
            disabled={isLoadingList}
          >
            Refresh
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

