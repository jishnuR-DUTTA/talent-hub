"use client";

import { useUserRole, type UserRole } from "@/hooks/use-user-role";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function RoleSwitcher() {
  const { role, setRole } = useUserRole();

  const handleRoleChange = (checked: boolean) => {
    setRole(checked ? 'recruiter' : 'applicant');
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="role-switch" className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
        Applicant
      </Label>
      <Switch
        id="role-switch"
        checked={role === 'recruiter'}
        onCheckedChange={handleRoleChange}
        aria-label="Toggle user role"
      />
      <Label htmlFor="role-switch" className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
        Recruiter
      </Label>
    </div>
  );
}
