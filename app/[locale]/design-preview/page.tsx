import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function DesignPreviewPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">UI Design Preview</h1>
        <p className="text-muted-foreground">
          Comparing current styles with proposed "Apple-style" updates.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Current Style Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Current Style</h2>
            <span className="text-xs bg-muted px-2 py-1 rounded">Default</span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login Account</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-current">Email</Label>
                <Input id="email-current" placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-current">Password</Label>
                <Input id="password-current" type="password" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-current" />
                <Label htmlFor="remember-current">Remember me</Label>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch id="mode-current" />
                  <Label htmlFor="mode-current">Airplane Mode</Label>
                </div>
              </div>
              <Button className="w-full">Sign In</Button>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button variant="secondary" size="sm">
                  Secondary
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">Component Sizes</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">icon</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Input className="w-32" placeholder="Default" />
            </div>
          </div>
        </section>

        {/* Proposed Style Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">
              Proposed Style (Apple-like)
            </h2>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              Simulated
            </span>
          </div>

          <Card className="rounded-xl shadow-sm border-black/5 dark:border-white/5">
            <CardHeader>
              <CardTitle>Login Account</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email-new" className="text-base">
                  Email
                </Label>
                <Input
                  id="email-new"
                  placeholder="name@example.com"
                  className="h-11 rounded-xl px-4 text-base shadow-sm border-black/10 dark:border-white/10 focus-visible:ring-offset-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-new" className="text-base">
                  Password
                </Label>
                <Input
                  id="password-new"
                  type="password"
                  className="h-11 rounded-xl px-4 text-base shadow-sm border-black/10 dark:border-white/10"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="remember-new" className="size-5 rounded-[6px]" />
                <Label htmlFor="remember-new" className="text-base font-normal">
                  Remember me
                </Label>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3">
                  <Switch id="mode-new" className="scale-110" />
                  <Label htmlFor="mode-new" className="text-base font-normal">
                    Airplane Mode
                  </Label>
                </div>
              </div>
              <Button className="w-full h-11 rounded-xl text-base font-medium shadow-sm">
                Sign In
              </Button>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="h-9 rounded-lg px-4">
                  Cancel
                </Button>
                <Button variant="secondary" className="h-9 rounded-lg px-4">
                  Secondary
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 p-4 border rounded-xl bg-muted/30">
            <h3 className="font-medium">Component Sizes (Proposed)</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button className="h-9 rounded-lg px-4 text-sm">Small</Button>
              <Button className="h-11 rounded-xl px-5 text-base">
                Default
              </Button>
              <Button className="h-12 rounded-xl px-6 text-lg">Large</Button>
              <Button size="icon" className="size-11 rounded-xl">
                icon
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Input className="w-32 h-11 rounded-xl" placeholder="Default" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
