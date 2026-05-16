import { useState } from "react";
import { Search, UserPlus, Users, X } from "lucide-react";
import { Avatar } from "../ui/avatar.jsx";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Select } from "../ui/select.jsx";
import { api } from "../../api.js";

export function MembersView({ project, canManage, onAddMember }) {
  const members = project?.members || [];
  const [memberForm, setMemberForm] = useState({ userId: "", name: "", role: "Member" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searching, setSearching] = useState(false);
  const showExternalMemberFields = !selectedUser && searchQuery.includes("@") && searchResults.length === 0;
  const canSubmitMember = Boolean(searchQuery.trim()) && !searching && (!showExternalMemberFields || Boolean(memberForm.name.trim()));

  async function handleSearch(query) {
    setSearchQuery(query);
    setSelectedUser(null);
    setMemberForm((currentForm) => ({ ...currentForm, userId: "" }));

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const data = await api(
        `/projects/${project._id}/search-users?q=${encodeURIComponent(query)}`,
      );
      setSearchResults(data.users || []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function selectUser(user) {
    setSelectedUser(user);
    setMemberForm({ ...memberForm, userId: user._id, name: "" });
    setSearchQuery(user.name);
    setSearchResults([]);
  }

  async function submitMember(event) {
    event.preventDefault();
    const email = selectedUser?.email || searchQuery.trim();

    if (!email) {
      return;
    }

    await onAddMember({
      email,
      ...(memberForm.name.trim() ? { name: memberForm.name.trim() } : {}),
      role: memberForm.role
    });
    setMemberForm({ userId: "", name: "", role: "Member" });
    setSelectedUser(null);
    setSearchQuery("");
  }

  return (
    <section className="members-layout">
      <Card>
        <CardHeader className="inline-card-header">
          <div>
            <span className="page-kicker">Project team</span>
            <CardTitle>Members</CardTitle>
          </div>
          <div className="members-actions">
            <div className="search-box">
              <Search size={16} />
              <Input placeholder="Find members..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined At</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const memberName = member.user?.name || member.name || member.email || "External member";
                  const memberEmail = member.user?.email || member.email || "";

                  return (
                    <tr key={member._id}>
                      <td>
                        <div className="member-cell">
                          <Avatar name={memberName} />
                          <strong>{memberName}</strong>
                        </div>
                      </td>
                      <td>{memberEmail}</td>
                      <td>
                        <Badge variant={member.role === "Admin" ? "info" : "success"}>
                          {member.role}
                        </Badge>
                      </td>
                      <td>{member.user ? "Registered user" : "External member"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <span className="page-kicker">Permissions</span>
          <CardTitle>Access Levels</CardTitle>
        </CardHeader>

        <CardContent>
          {canManage && (
            <form className="member-form invite-form" onSubmit={submitMember}>
              <div className="member-search-field">
                <Input
                  placeholder="Search or enter an email..."
                  value={searchQuery}
                  onChange={(event) => handleSearch(event.target.value)}
                  autoComplete="off"
                  required
                />

                {searchResults.length > 0 && (
                  <div className="member-search-results">
                    {searchResults.map((user) => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => selectUser(user)}
                        className="member-search-result"
                      >
                        <Avatar name={user.name} />

                        <div>
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedUser && (
                <div className="selected-member">
                  <Avatar name={selectedUser.name} />

                  <div>
                    <strong>{selectedUser.name}</strong>
                    <span>{selectedUser.email}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchQuery("");

                      setMemberForm({
                        userId: "",
                        name: "",
                        role: "Member",
                      });
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {showExternalMemberFields && (
                  <div className="external-member-fields">
                    <Input
                      placeholder="External member name"
                      value={memberForm.name}
                      onChange={(event) =>
                        setMemberForm({
                          ...memberForm,
                          name: event.target.value,
                        })
                      }
                      required
                    />

                    <small className="text-muted-foreground">
                      No registered user found. External member will be added.
                    </small>
                  </div>
                )}

              <Select
                value={memberForm.role}
                onChange={(event) =>
                  setMemberForm({
                    ...memberForm,
                    role: event.target.value,
                  })
                }
              >
                <option>Member</option>
                <option>Admin</option>
              </Select>

              <Button type="submit" disabled={!canSubmitMember}>
                <UserPlus size={16} />
                Add Member
              </Button>
            </form>
          )}

          <div className="role-cards">
            <div className="role-card">
              <div className="role-icon admin">
                <Users size={22} />
              </div>

              <div>
                <strong>Admin</strong>
                <span>Full access to projects, members, and settings.</span>
              </div>
            </div>

            <div className="role-card">
              <div className="role-icon member">
                <Users size={22} />
              </div>

              <div>
                <strong>Member</strong>
                <span>Can view and manage tasks in assigned projects.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
