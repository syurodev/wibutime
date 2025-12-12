import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspaceModal } from "@/features/organization/components/create-workspace-modal";
import { getMyOrganizations } from "@/features/organization/queries";
import { Organization } from "@/features/organization/types";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function WorkspacesPage() {
  const t = await getTranslations("organization.list");
  const { owned, member } = await getMyOrganizations();

  return (
    <div className="container py-10 max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("description")}</p>
        </div>
        {/* Create button could go here or in owned section if empty */}
      </div>

      {/* Owned Workspace Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {t("owned_workspace")}
          <Badge variant="secondary" className="text-xs font-normal">
            {owned ? 1 : 0}/1
          </Badge>
        </h2>

        {owned ? (
          <OwnedWorkspaceCard org={owned} t={t} />
        ) : (
          <CreateWorkspacePlaceholder t={t} />
        )}
      </section>

      {/* Joined Workspaces Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {t("joined_workspaces")}
          <Badge variant="secondary" className="text-xs font-normal">
            {member.length}/5
          </Badge>
        </h2>

        {member.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {member.map((org) => (
              <JoinedWorkspaceCard key={org.id} org={org} t={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg bg-muted/30">
            <p className="text-muted-foreground">{t("no_joined_workspaces")}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function OwnedWorkspaceCard({ org, t }: { org: Organization; t: any }) {
  return (
    <Card className="border-primary/20 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        {org.status === "flagged" && (
          <Badge variant="destructive">{t("status_flagged")}</Badge>
        )}
      </div>

      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
          <AvatarImage src={org.avatar_url || ""} alt={org.name} />
          <AvatarFallback className="text-lg bg-primary/10 text-primary">
            {org.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-2xl">{org.name}</CardTitle>
          <CardDescription className="text-base">@{org.slug}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {org.description?.text && (
          <p className="mb-6 text-muted-foreground">{org.description.text}</p>
        )}

        <div className="grid grid-cols-3 gap-4 mb-2">
          <StatItem
            icon={Users}
            label={t("stat_members")}
            value={org.member_count}
          />
          <StatItem icon={Activity} label={t("stat_projects")} value={0} />{" "}
          {/* Assuming 0 for now */}
          <StatItem
            icon={BookOpen}
            label={t("stat_translations")}
            value={org.completed_translations}
          />
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 bg-muted/30 py-4">
        <Button asChild className="flex-1">
          <Link href={`/workspace/${org.slug}`}>
            {t("enter_workspace")} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/workspace/${org.slug}/settings`}>
            <Settings className="mr-2 h-4 w-4" /> {t("settings")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function JoinedWorkspaceCard({ org, t }: { org: Organization; t: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={org.avatar_url || ""} alt={org.name} />
          <AvatarFallback>
            {org.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <CardTitle className="truncate text-lg">{org.name}</CardTitle>
          <CardDescription className="truncate">@{org.slug}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {org.member_count}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" /> {org.completed_translations}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t bg-muted/20 flex gap-2">
        <Button size="sm" variant="secondary" className="w-full" asChild>
          <Link href={`/workspace/${org.slug}`}>{t("enter")}</Link>
        </Button>
        {/* Leave button - would need a client component/action */}
      </CardFooter>
    </Card>
  );
}

function CreateWorkspacePlaceholder({ t }: { t: any }) {
  return (
    <CreateWorkspaceModal
      langNamespace="organization.list.create_modal"
      trigger={
        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center h-[300px] hover:bg-muted/10 transition-colors cursor-pointer group">
          <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:bg-primary/20 transition-colors">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("create_workspace_title")}
          </h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {t("create_workspace_desc")}
          </p>
          <Button variant="secondary">{t("create_button")}</Button>
        </Card>
      }
    />
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background border">
      <Icon className="h-5 w-5 text-muted-foreground mb-1" />
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
