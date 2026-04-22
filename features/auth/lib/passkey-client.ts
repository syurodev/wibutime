const toBuffer = (str: string): ArrayBuffer =>
  Uint8Array.from(
    atob(str.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0)
  ).buffer

const toBase64url = (buf: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")

type B64UrlString = string

export type PublicKeyCredentialRequestOptionsJSON = Omit<
  PublicKeyCredentialRequestOptions,
  "challenge" | "allowCredentials"
> & {
  challenge: B64UrlString
  allowCredentials?: Array<Omit<PublicKeyCredentialDescriptor, "id"> & { id: B64UrlString }>
}

export type PublicKeyCredentialCreationOptionsJSON = Omit<
  PublicKeyCredentialCreationOptions,
  "challenge" | "user" | "excludeCredentials"
> & {
  challenge: B64UrlString
  user: Omit<PublicKeyCredentialUserEntity, "id"> & { id: B64UrlString }
  excludeCredentials?: Array<Omit<PublicKeyCredentialDescriptor, "id"> & { id: B64UrlString }>
}

export function normalizeRequestOptions(
  options: PublicKeyCredentialRequestOptionsJSON
): PublicKeyCredentialRequestOptions {
  const normalized: PublicKeyCredentialRequestOptions = {
    ...options,
    challenge: toBuffer(options.challenge),
    allowCredentials: options.allowCredentials?.map((c) => ({
      ...c,
      id: toBuffer(c.id),
    })),
  }
  return normalized
}

export function normalizeCreationOptions(
  options: PublicKeyCredentialCreationOptionsJSON
): PublicKeyCredentialCreationOptions {
  const normalized: PublicKeyCredentialCreationOptions = {
    ...options,
    challenge: toBuffer(options.challenge),
    user: {
      ...options.user,
      id: toBuffer(options.user.id),
    },
    excludeCredentials: options.excludeCredentials?.map((c) => ({
      ...c,
      id: toBuffer(c.id),
    })),
  }
  return normalized
}

export function encodeCredential(
  cred: PublicKeyCredential,
  isRegistration: boolean
) {
  const response = cred.response

  if (isRegistration) {
    const att = response as AuthenticatorAttestationResponse
    return {
      id: cred.id,
      rawId: toBase64url(cred.rawId),
      type: cred.type,
      response: {
        clientDataJSON: toBase64url(att.clientDataJSON),
        attestationObject: toBase64url(att.attestationObject),
      },
    }
  }

  const asr = response as AuthenticatorAssertionResponse
  return {
    id: cred.id,
    rawId: toBase64url(cred.rawId),
    type: cred.type,
    response: {
      clientDataJSON: toBase64url(asr.clientDataJSON),
      authenticatorData: toBase64url(asr.authenticatorData),
      signature: toBase64url(asr.signature),
      userHandle: asr.userHandle ? toBase64url(asr.userHandle) : null,
    },
  }
}

