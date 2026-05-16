import { Bell, Lock, Palette, Plug, UserRound } from "lucide-react";
import { Avatar } from "../ui/avatar.jsx";
import { Button } from "../ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Select } from "../ui/select.jsx";
import { Textarea } from "../ui/textarea.jsx";

export function SettingsView({ user, role }) {
  return (
      <Card>
        <CardHeader>
          <span className="page-kicker">Account</span>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="settings-form">
            <div className="profile-picture-row">
              <Avatar name={user.name} />
              <Button variant="outline" size="sm" type="button">Change</Button>
            </div>
            <label>
              Full Name
              <Input value={user.name} readOnly />
            </label>
            <label>
              Email
              <Input value={user.email} readOnly />
            </label>
            <label>
              Role
              <Select value={role} disabled>
                <option>{role}</option>
              </Select>
            </label>
            <label>
              About
              <Textarea defaultValue="Project manager and product designer." />
            </label>
            <Button className="save-settings-button" type="button">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
  );
}
