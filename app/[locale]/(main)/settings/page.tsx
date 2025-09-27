import {getNavConfig} from "@/components/layout/nav/nav-configs";
import NavigationSetter from "@/components/layout/nav/navigation-setter";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Separator} from "@/components/ui/separator";
import {getTranslations} from "next-intl/server";
import {AccountSettings} from "./components/account-settings";
import {PreferencesSettings} from "./components/preferences-settings";
import {PrivacySettings} from "./components/privacy-settings";
import {DisplaySettings} from "./components/display-settings";
import {AboutSettings} from "./components/about-settings";
import {CircleUserRound, Cog, Eye, Notebook, Shield} from "lucide-react";

export default async function SettingsPage() {
  const t = await getTranslations("Common");
  const tSettings = await getTranslations("Common.settings");
  const navItems = getNavConfig("settings");

  return (
      <>
        <NavigationSetter items={navItems}/>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {tSettings("title")}
              </h1>
              <p className="text-muted-foreground">
                {tSettings("description")}
              </p>
            </div>

            <Separator/>

            <Tabs defaultValue="account" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="account">
                  <CircleUserRound/>
                  <span className={"hidden md:inline"}>{tSettings("tabs.account")}</span>
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  <Cog/>
                  <span className={"hidden md:inline"}>{tSettings("tabs.preferences")}</span>
                </TabsTrigger>
                <TabsTrigger value="privacy">
                  <Shield/>
                  <span className={"hidden md:inline"}>{tSettings("tabs.privacy")}</span>
                </TabsTrigger>
                <TabsTrigger value="display">
                  <Eye/>
                  <span className={"hidden md:inline"}>{tSettings("tabs.display")}</span>
                </TabsTrigger>
                <TabsTrigger value="about">
                  <Notebook/>
                  <span className={"hidden md:inline"}>{tSettings("tabs.about")}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{tSettings("tabs.account")}</CardTitle>
                    <CardDescription>
                      {tSettings("account.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AccountSettings/>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{tSettings("tabs.preferences")}</CardTitle>
                    <CardDescription>
                      {tSettings("preferences.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PreferencesSettings/>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{tSettings("tabs.privacy")}</CardTitle>
                    <CardDescription>
                      {tSettings("privacy.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PrivacySettings/>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="display" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{tSettings("tabs.display")}</CardTitle>
                    <CardDescription>
                      {tSettings("display.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DisplaySettings/>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{tSettings("tabs.about")}</CardTitle>
                    <CardDescription>
                      {tSettings("about.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AboutSettings/>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </>
  );
}