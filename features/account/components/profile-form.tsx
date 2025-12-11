"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BasicEditor } from "@/components/ui/basic-editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageCropper } from "@/components/ui/image-cropper";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/features/user/actions";
import { UserProfile } from "@/features/user/types";
import { useUploadFile } from "@/hooks/use-upload-file";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .optional(),
  full_name: z.string().optional(),
  display_name: z.string().optional(),
  bio: z.any().optional(), // PlateJS value
  // avatar_url handled separately or via upload hook
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  readonly initialData: UserProfile;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const t = useTranslations("account.profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading } = useUploadFile({
    onUploadError: (error: any) => {
      toast.error(error.message || "Upload failed");
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialData.username || "",
      full_name: initialData.full_name || "",
      display_name: initialData.display_name || "",
      bio: initialData.bio || [{ type: "p", children: [{ text: "" }] }],
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSelectedImage(reader.result as string);
        setIsCropperOpen(true);
      });
      reader.readAsDataURL(file);
      // Reset input immediately so same file can be selected again if cancelled
      e.target.value = "";
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropperOpen(false);

    // Create a File from Blob
    const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });

    try {
      const result = await uploadFile(file, "avatar");
      if (result) {
        // Update avatar via server action
        await updateUserProfile({ avatar_url: result.key });
        toast.success(t("avatar_updated"));
        // Ideally we update the UI optimistically or refresh
        // For now, let's just refresh the page or rely on router cache invalidation if configured
        globalThis.window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update avatar");
    }
  };

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);
    try {
      await updateUserProfile(values);
      toast.success(t("success"));
      // Router refresh is handled by the server action revalidating tag,
      // but next/navigation router.refresh() might be needed for client update visualization if using router cache.
      // However server action revalidatePath/revalidateTag clears router cache for that path.
    } catch (error: any) {
      if (error.message.includes("USERNAME_TAKEN")) {
        form.setError("username", { message: "Username is already taken" });
      } else {
        toast.error(error.message || "Something went wrong");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-x-8">
          <div className="relative group">
            <Avatar
              className="h-24 w-24 cursor-pointer border-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <AvatarImage
                src={getImageUrl(initialData.avatar_url) || undefined}
                className={isUploading ? "opacity-50" : ""}
              />
              <AvatarFallback>
                {getInitials(
                  initialData.full_name ?? initialData.username ?? ""
                )}
              </AvatarFallback>
              {/* Overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading || isLoading}
            />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">
              {t("profile_picture")}
            </h4>
            <p className="text-sm text-muted-foreground">
              Click to format. Square ratio.
            </p>
          </div>
        </div>

        <ImageCropper
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          isLoading={isUploading}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    {...field}
                    disabled={!!initialData.username}
                  />
                </FormControl>
                {/* Optional: Add explanation message */}
                {!!initialData.username && (
                  <p className="text-[0.8rem] text-muted-foreground">
                    Username cannot be changed once set.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("display_name")}</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("full_name")}</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("bio")}</FormLabel>
              <FormControl>
                <BasicEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Tell us about yourself..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {t("save")}
        </Button>
      </form>
    </Form>
  );
}
