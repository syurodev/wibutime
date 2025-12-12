"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { BasicEditor } from "@/components/ui/basic-editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createOrganizationAction } from "../actions";

interface CreateWorkspaceModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  langNamespace?: string; // e.g. "workspace.list"
}

const initialState = {
  message: "",
  errors: {},
};

export function CreateWorkspaceModal({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  langNamespace = "organization.list.create_modal",
}: CreateWorkspaceModalProps) {
  const t = useTranslations(langNamespace);
  const router = useRouter();

  // Manage internal state if not controlled
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen === undefined ? internalOpen : controlledOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const [state, formAction, isPending] = useActionState(
    createOrganizationAction,
    initialState
  );

  const [descriptionValue, setDescriptionValue] = useState<any>([
    {
      type: "p",
      children: [{ text: "" }],
    },
  ]);

  // Close dialog on success
  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      // Optional: Refresh or redirect if needed, but Action handles revalidate
      // router.refresh();
    }
  }, [state?.success, setOpen, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t("trigger_label")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Validaton Error Message */}
            {state?.message && !state?.success && (
              <div className="text-sm font-medium text-destructive">
                {state.message}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name" className="text-left">
                {t("labels.name")}
              </Label>
              <Input
                id="name"
                name="name"
                placeholder={t("placeholders.name")}
                required
                disabled={isPending}
                aria-invalid={!!state?.errors?.name}
              />
              {state?.errors?.name && (
                <p className="text-sm text-destructive">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-left">
                {t("labels.description")}
              </Label>
              <div className="min-h-[150px]">
                <BasicEditor
                  value={descriptionValue}
                  onChange={setDescriptionValue}
                  placeholder={t("placeholders.description")}
                />
                <input
                  type="hidden"
                  name="description"
                  value={JSON.stringify(descriptionValue)}
                />
              </div>
              {state?.errors?.description && (
                <p className="text-sm text-destructive">
                  {state.errors.description[0]}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("creating") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
