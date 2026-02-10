import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/elements";
import { Avatar } from "@/components/ui/avatar";
import { USERS } from "@/data/mock/users";
import { Plus, MoreHorizontal, Shield, ShieldCheck } from "lucide-react";

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

const roleStyles: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  manager: "bg-warning/10 text-warning border-warning/20",
  analyst: "bg-success/10 text-success border-success/20",
  viewer: "bg-muted text-muted-foreground border-border",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = useMemo(() => {
    return USERS.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || user.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [search, roleFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/50 p-5">
          <span className="text-sm text-muted-foreground">Total Users</span>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{USERS.length}</p>
        </Card>
        <Card className="border-border/50 p-5">
          <span className="text-sm text-muted-foreground">Active</span>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-success">
            {USERS.filter((u) => u.status === "active").length}
          </p>
        </Card>
        <Card className="border-border/50 p-5">
          <span className="text-sm text-muted-foreground">Admins</span>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-primary">
            {USERS.filter((u) => u.role === "admin").length}
          </p>
        </Card>
        <Card className="border-border/50 p-5">
          <span className="text-sm text-muted-foreground">Suspended</span>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-destructive">
            {USERS.filter((u) => u.status === "suspended").length}
          </p>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-sm flex-1">
          <SearchInput
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 bg-card"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="h-9 gap-2">
            <Plus className="h-3.5 w-3.5" />
            Add User
          </Button>
        </div>
      </div>

      <Card className="border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Transactions</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id} className="cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8" fallback={user.initials} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`gap-1 px-1.5 py-0 text-[10px] capitalize ${roleStyles[user.role]}`}>
                    {user.role === "admin" ? <ShieldCheck className="h-2.5 w-2.5" /> : user.role === "manager" ? <Shield className="h-2.5 w-2.5" /> : null}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`px-1.5 py-0 text-[10px] capitalize ${statusStyles[user.status]}`}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                <TableCell className="text-right font-mono text-sm text-foreground">{user.transactions}</TableCell>
                <TableCell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                      <DropdownMenu.Item>View Profile</DropdownMenu.Item>
                      <DropdownMenu.Item>Edit Permissions</DropdownMenu.Item>
                      <DropdownMenu.Item className="text-destructive">Suspend User</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
