import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { useThemeStore } from "@/store/use-theme-store";

export default function SettingsPage() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <Tabs.Root defaultValue="profile" className="flex flex-col gap-6">
      <Tabs.List className="w-fit">
        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger value="preferences">Preferences</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="profile">
        <div className="flex flex-col gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-16 w-16" fallback="JD" />
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <span className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" className="bg-background" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" className="bg-background" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@apex.io" className="bg-background" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="bg-background" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Administrator" disabled className="max-w-sm bg-muted" />
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs.Content>

      <Tabs.Content value="preferences">
        <div className="flex flex-col gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <span className="text-sm text-muted-foreground">Select your preferred color scheme.</span>
                </div>
                <Select value={theme} onValueChange={(v: "light" | "dark" | "system") => setTheme(v)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">Currency</span>
                  <span className="text-sm text-muted-foreground">Default currency for financial data.</span>
                </div>
                <Select defaultValue="usd">
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                    <SelectItem value="jpy">JPY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">Timezone</span>
                  <span className="text-sm text-muted-foreground">Set your local timezone for timestamps.</span>
                </div>
                <Select defaultValue="est">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">Eastern (UTC-5)</SelectItem>
                    <SelectItem value="cst">Central (UTC-6)</SelectItem>
                    <SelectItem value="pst">Pacific (UTC-8)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Data Display</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">Compact Tables</span>
                  <span className="text-sm text-muted-foreground">Show more rows with reduced spacing.</span>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">Show Decimal Places</span>
                  <span className="text-sm text-muted-foreground">Display cents in currency values.</span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs.Content>

      <Tabs.Content value="security">
        <div className="flex flex-col gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Password</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="max-w-lg grid-cols-1 gap-4 sm:grid sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" className="bg-background" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" className="bg-background" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" className="bg-background" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">Authenticator App</span>
                  <span className="text-sm text-muted-foreground">Use an authenticator app for 2FA codes.</span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">Delete Account</span>
                  <span className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</span>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs.Content>

      <Tabs.Content value="notifications">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Transaction Alerts</span>
                <span className="text-sm text-muted-foreground">Receive alerts for large or failed transactions.</span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Security Alerts</span>
                <span className="text-sm text-muted-foreground">Get notified about suspicious activity and login attempts.</span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Weekly Reports</span>
                <span className="text-sm text-muted-foreground">Receive weekly summary of financial performance.</span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Marketing Emails</span>
                <span className="text-sm text-muted-foreground">Product updates, tips, and promotional content.</span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </Tabs.Content>
    </Tabs.Root>
  );
}
