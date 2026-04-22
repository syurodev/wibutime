import { MagicLinkForm } from "@/features/auth/components/magic-link-form"
import { VerifyMagicLink } from "@/features/auth/components/verify-magic-link"
import { GalleryHorizontalEnd } from "lucide-react"
import Image from "next/image"

export default async function MagicLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const token = resolvedSearchParams?.token

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryHorizontalEnd className="size-4" />
            </div>
            WibuTime
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {token ? (
              <div className="w-full rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <VerifyMagicLink token={token} />
              </div>
            ) : (
              <MagicLinkForm />
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/images/auth.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={1920}
          height={1080}
          loading="eager"
        />
      </div>
    </div>
  )
}
