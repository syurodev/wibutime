"use client";

import { AsyncSelect } from "@/components/ui/async-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { mergeGenre, previewMergeGenre } from "@/features/genre/actions";
import { useGenres } from "@/hooks/use-genres";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { MergeFlowVisualizer } from "../merge-flow-visualizer";

const formSchema = z.object({
  targetId: z.string().min(1, "Vui lòng chọn thể loại đích"),
  sourceIds: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất 1 thể loại nguồn"),
});

interface MergeGenreDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  // genres: Genre[]; // Removed as we fetch internally now
  readonly onSuccess: () => void;
}

export function MergeGenreDialog({
  open,
  onOpenChange,
  // genres,
  onSuccess,
}: MergeGenreDialogProps) {
  const [isPending, startTransition] = useTransition();

  // States for search
  const [targetSearch, setTargetSearch] = useState("");
  const [sourceSearch, setSourceSearch] = useState("");

  // Hook for Target Genres
  const {
    data: targetGenres,
    isLoading: isLoadingTarget,
    loadMore: loadMoreTarget,
    hasMore: hasMoreTarget,
    isLoadingMore: isLoadingMoreTarget,
  } = useGenres(targetSearch);

  // Hook for Source Genres
  const {
    data: sourceGenres,
    isLoading: isLoadingSource,
    loadMore: loadMoreSource,
    hasMore: hasMoreSource,
    isLoadingMore: isLoadingMoreSource,
  } = useGenres(sourceSearch);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetId: "",
      sourceIds: [],
    },
  });

  const [selectedSources, setSelectedSources] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedTarget, setSelectedTarget] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [previewData, setPreviewData] = useState<{
    affected_novels: {
      id: string;
      title: string;
      slug: string;
      cover_image_url?: string | null;
    }[];
    source_genres?: string[] | null;
  } | null>(null);

  // Prepare options
  const targetOptions = targetGenres.map((g) => ({
    label: g.name,
    value: g.id,
  }));
  const sourceOptions = sourceGenres
    .map((g) => ({
      label: g.name,
      value: g.id,
    }))
    .filter((opt) => opt.value !== selectedTarget?.value);

  const t = useTranslations("dashboard.merge");
  const tEntities = useTranslations("dashboard.entities");
  const entityName = tEntities("genre");
  const entityPlural = tEntities("genres");

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        if (step === 1) {
          const data = await previewMergeGenre({
            target_id: values.targetId,
            source_ids: values.sourceIds,
          });
          setPreviewData(data);
          setStep(2);
        } else {
          await mergeGenre({
            target_id: values.targetId,
            source_ids: values.sourceIds,
          });
          toast.success(t("success", { entity: entityName }));
          onOpenChange(false);
          form.reset();
          setSelectedSources([]);
          setSelectedTarget(null);
          setTargetSearch("");
          setSourceSearch("");
          setStep(1);
          setPreviewData(null);
          onSuccess();
        }
      } catch (error: any) {
        toast.error(error.message || t("error"));
      }
    });
  }

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)();
  };

  // Reset step when closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep(1);
      setPreviewData(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{t("title", { entity: entityName })}</DialogTitle>
          <DialogDescription>
            {t("description", { items: entityPlural })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <DialogDescription className="mb-4">
            {step === 1
              ? t("step1Desc", { items: entityPlural, entity: entityName })
              : t("step2Desc")}
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {step === 1 ? (
                <>
                  <FormField
                    control={form.control}
                    name="targetId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("targetLabel", { entity: entityName })}
                        </FormLabel>
                        <FormControl>
                          <AsyncSelect
                            options={targetOptions}
                            value={field.value}
                            selectedLabel={selectedTarget?.label}
                            onChange={(val) => {
                              if (!val) {
                                setSelectedTarget(null);
                                field.onChange("");
                                return;
                              }
                              // Find label from options if possible, else we might lose it if not careful.
                              // But since we selected from options, it must exist there.
                              const opt = targetOptions.find(
                                (o) => o.value === val
                              );
                              if (opt) setSelectedTarget(opt);
                              field.onChange(val);

                              // Remove from sources if present to avoid self-merge
                              if (val) {
                                const newSources = selectedSources.filter(
                                  (s) => s.value !== val
                                );
                                if (
                                  newSources.length !== selectedSources.length
                                ) {
                                  setSelectedSources(newSources);
                                  form.setValue(
                                    "sourceIds",
                                    newSources.map((s) => s.value)
                                  );
                                }
                              }
                            }}
                            placeholder={t("searchTargetPlaceholder", {
                              entity: entityName,
                            })}
                            onSearch={setTargetSearch}
                            onLoadMore={loadMoreTarget}
                            loading={isLoadingTarget || isLoadingMoreTarget}
                            hasMore={hasMoreTarget}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sourceIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("sourceLabel", { items: entityPlural })}
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={sourceOptions}
                            selected={selectedSources}
                            onChange={(selected) => {
                              setSelectedSources(selected);
                              field.onChange(selected.map((s) => s.value));
                            }}
                            placeholder={t("searchSourcePlaceholder", {
                              items: entityPlural,
                            })}
                            onSearch={setSourceSearch}
                            onLoadMore={loadMoreSource}
                            loading={isLoadingSource || isLoadingMoreSource}
                            hasMore={hasMoreSource}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Visual Preview (Simplified for selection step) */}
                  {(selectedTarget || selectedSources.length > 0) && (
                    <div className="flex items-center justify-between gap-2 p-3 bg-muted/20 rounded-lg text-sm">
                      <div className="flex-1">
                        <span className="text-muted-foreground block text-xs">
                          {t("previewHeader", { items: entityPlural })}:
                        </span>
                        <span className="font-medium text-destructive">
                          {selectedSources.length} {entityPlural}
                        </span>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground" />
                      <div className="flex-1 text-right">
                        <span className="text-muted-foreground block text-xs">
                          {t("mergeInto")}:
                        </span>
                        {selectedTarget ? (
                          <span className="font-medium text-primary">
                            {selectedTarget.label}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic">
                            {tEntities("genre")}?
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {/* Confirmation Preview UI */}
                  <div className="rounded-md border p-6 bg-muted/10">
                    <MergeFlowVisualizer
                      sources={selectedSources}
                      target={selectedTarget}
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      {t("affectedNovels", {
                        count: previewData?.affected_novels.length || 0,
                      })}
                    </h4>
                    {previewData && previewData.affected_novels.length > 0 ? (
                      <div className="max-h-[300px] overflow-y-auto border rounded-md divide-y">
                        {previewData.affected_novels.map((novel) => (
                          <div
                            key={novel.id}
                            className="p-2 flex items-center gap-3"
                          >
                            <Avatar className="w-8 h-12 rounded-xs border overflow-hidden">
                              <AvatarImage
                                src={getImageUrl(novel.cover_image_url)}
                              />
                              <AvatarFallback className="w-8 h-12 rounded-none font-semibold text-xl">
                                {getInitials(novel.title)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 w-full overflow-hidden">
                              <p
                                className="text-sm font-medium line-clamp-1 break-all"
                                title={novel.title}
                              >
                                {novel.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {novel.slug}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground border rounded-md border-dashed">
                        {t("noAffectedNovels", { items: entityPlural })}
                      </div>
                    )}
                  </div>

                  <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="shrink-0">
                        <AlertTriangle
                          className="h-5 w-5 text-yellow-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          {t("warning.title")}
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            {t.rich("warning.message", {
                              count: selectedSources.length,
                              items: entityPlural,
                              target: selectedTarget?.label || "",
                              b: (chunks) => <b>{chunks}</b>,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>

        <DialogFooter className="px-6 py-4 border-t gap-2 sm:gap-0">
          {step === 2 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep(1);
                setPreviewData(null);
              }}
              disabled={isPending}
              className="mr-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("actions.back")}
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="mr-2"
          >
            {t("actions.cancel")}
          </Button>

          {step === 1 ? (
            <Button
              type="button"
              onClick={handlePreview}
              disabled={
                !selectedTarget || selectedSources.length === 0 || isPending
              }
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("actions.continue")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="destructive"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("actions.confirm")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
