"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FullEditor } from "@/components/ui/full-editor";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  chapter_number: z.number().min(1, "Chapter number must be at least 1"),
  title: z.string().min(1, "Title is required").max(500),
  content: z.any().refine((val) => {
    // Basic validation for Plate content
    if (!val) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }, "Content is required"),
  status: z.enum(["draft", "published", "scheduled"]),
  is_free: z.boolean(),
  price: z.number().optional(),
  currency: z.string().length(3).optional(),
});

export type ChapterFormValues = z.infer<typeof formSchema>;

interface ChapterFormProps {
  readonly initialValues?: Partial<ChapterFormValues>;
  readonly onSubmit: (values: ChapterFormValues) => Promise<void>;
  readonly isSubmitting: boolean;
  readonly submitLabel?: string;
}

export function ChapterForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Lưu Chapter",
}: ChapterFormProps) {
  const form = useForm<ChapterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chapter_number: initialValues?.chapter_number || 1,
      title: initialValues?.title || "",
      content: initialValues?.content || [
        {
          type: "p",
          children: [{ text: "" }],
        },
      ],
      status: initialValues?.status || "draft",
      is_free: initialValues?.is_free || false,
      price: initialValues?.price || 0,
      currency: initialValues?.currency || "VND",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nội dung Chapter</CardTitle>
                <CardDescription>
                  Nhập tiêu đề và nội dung chính của chapter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề Chapter</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <FullEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Bắt đầu viết câu chuyện của bạn..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="chapter_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số thứ tự</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Số thứ tự của chapter trong volume
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Bản nháp</SelectItem>
                          <SelectItem value="published">Công khai</SelectItem>
                          <SelectItem value="scheduled">Lên lịch</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_free"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Miễn phí</FormLabel>
                        <FormDescription>
                          Chapter này có miễn phí không?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!form.watch("is_free") && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá (Coin)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : e.target.valueAsNumber
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Save className="mr-2 h-4 w-4" />
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
