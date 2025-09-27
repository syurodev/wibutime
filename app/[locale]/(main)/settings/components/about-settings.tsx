"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InfoIcon, ExternalLinkIcon, HeartIcon, MessageSquareIcon, BookIcon, ShieldIcon, CookieIcon, MailIcon, GitBranchIcon, CalendarIcon } from "lucide-react";

const feedbackSchema = z.object({
    feedback: z.string().min(10, "Feedback must be at least 10 characters").max(1000, "Feedback must be less than 1000 characters"),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const appInfo = {
    name: "WibuTime",
    version: "1.0.0",
    buildDate: "2024-09-22",
    buildNumber: "202409220001",
    description: "Your personal anime, manga & light novel tracker",
};

const links = [
    {
        key: "terms",
        title: "Terms of Service",
        description: "Read our terms and conditions",
        icon: BookIcon,
        external: true,
        href: "/terms",
    },
    {
        key: "privacy",
        title: "Privacy Policy",
        description: "Learn how we protect your data",
        icon: ShieldIcon,
        external: true,
        href: "/privacy",
    },
    {
        key: "cookies",
        title: "Cookie Policy",
        description: "Information about our cookie usage",
        icon: CookieIcon,
        external: true,
        href: "/cookies",
    },
    {
        key: "support",
        title: "Contact Support",
        description: "Get help with your account or technical issues",
        icon: MailIcon,
        external: true,
        href: "mailto:support@wibutime.com",
    },
];

const techStack = [
    "Next.js 15",
    "React 19",
    "TypeScript",
    "TailwindCSS",
    "Radix UI",
    "NextAuth.js",
    "next-intl",
];

export function AboutSettings() {
    const t = useTranslations("Common");
    const tCommon = useTranslations("Common");
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            feedback: "",
        },
    });

    const onSubmitFeedback = async (data: FeedbackFormValues) => {
        setIsLoading(true);
        try {
            // TODO: Submit feedback to backend
            console.log("Submitting feedback:", data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setFeedbackSubmitted(true);
            form.reset();

            // Reset success message after 3 seconds
            setTimeout(() => setFeedbackSubmitted(false), 3000);
        } catch (error) {
            console.error("Failed to submit feedback:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExternalLink = (href: string) => {
        if (href.startsWith("mailto:")) {
            window.location.href = href;
        } else {
            window.open(href, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="space-y-8">
            {/* Application Information */}
            <Card>
                <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                    <InfoIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <CardTitle>{t("settings.about.app.title")}</CardTitle>
                        <CardDescription>{t("settings.about.app.description")}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Application Name</span>
                                <Badge variant="secondary">{appInfo.name}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{t("settings.about.app.version")}</span>
                                <Badge variant="outline">{appInfo.version}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{t("settings.about.app.buildDate")}</span>
                                <span className="text-sm text-muted-foreground flex items-center space-x-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    <span>{appInfo.buildDate}</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Build Number</span>
                                <span className="text-sm text-muted-foreground font-mono">
                                    {appInfo.buildNumber}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <GitBranchIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Technology Stack</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="text-xs">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Important Links */}
            <Card>
                <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                    <ExternalLinkIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <CardTitle>{t("settings.about.links.title")}</CardTitle>
                        <CardDescription>Legal documents and support resources</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {links.map((link) => (
                            <Card
                                key={link.key}
                                className="hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => handleExternalLink(link.href)}
                            >
                                <CardContent className="flex items-center space-x-4 p-4">
                                    <link.icon className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm font-medium">{link.title}</p>
                                            {link.external && (
                                                <ExternalLinkIcon className="h-3 w-3 text-muted-foreground" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {link.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Feedback Section */}
            <Card>
                <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                    <MessageSquareIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <CardTitle>{t("settings.about.links.feedback")}</CardTitle>
                        <CardDescription>
                            Help us improve by sharing your thoughts and suggestions
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {feedbackSubmitted ? (
                        <div className="flex items-center justify-center p-8 text-center">
                            <div className="space-y-2">
                                <HeartIcon className="h-8 w-8 text-green-500 mx-auto" />
                                <p className="text-sm font-medium text-green-600">
                                    Thank you for your feedback!
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    We appreciate your input and will review it carefully.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmitFeedback)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="feedback"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your feedback</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us what you think about WibuTime, report bugs, or suggest new features..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading}>
                                    <MessageSquareIcon className="h-4 w-4 mr-2" />
                                    {isLoading ? tCommon("loading") : t("settings.about.links.feedback")}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>

            {/* Legal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("settings.about.legal.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            {t("settings.about.legal.copyright")}
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                            <span>{t("settings.about.legal.opensource")}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                                        {t("settings.about.legal.licenses")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>{t("settings.about.legal.licenses")}</DialogTitle>
                                        <DialogDescription>
                                            Open source libraries and their licenses used in this application
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="text-sm">
                                            <h4 className="font-medium mb-2">Major Dependencies</h4>
                                            <ul className="space-y-1 text-muted-foreground">
                                                <li>• Next.js - MIT License</li>
                                                <li>• React - MIT License</li>
                                                <li>• TypeScript - Apache License 2.0</li>
                                                <li>• TailwindCSS - MIT License</li>
                                                <li>• Radix UI - MIT License</li>
                                                <li>• NextAuth.js - ISC License</li>
                                                <li>• next-intl - MIT License</li>
                                                <li>• Lucide React - ISC License</li>
                                                <li>• React Hook Form - MIT License</li>
                                                <li>• Zod - MIT License</li>
                                            </ul>
                                        </div>
                                        <Separator />
                                        <p className="text-xs text-muted-foreground">
                                            For a complete list of dependencies and their licenses,
                                            please check the package.json file in our source code.
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}