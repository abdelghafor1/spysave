"use client";

import { ChevronLeft, Plus, Users } from "lucide-react";
import { User, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ServiceMenu } from "@/components/ServiceMenu";
import {
  SpySaveWorkspace,
  saveWorkspace,
  watchUserWorkspaces,
} from "@/lib/ads";
import { auth } from "@/lib/firebase";

export default function WorkspacePage() {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<SpySaveWorkspace[]>([]);
  const [workspaceName, setWorkspaceName] = useState("SpySave workspace");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] =
    useState<"Admin" | "Member" | "Viewer">("Member");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setWorkspaces([]);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    return watchUserWorkspaces(user.uid, setWorkspaces, (watchError) =>
      setError(watchError.message),
    );
  }, [user]);

  async function createWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !workspaceName.trim()) return;

    setStatus("Saving workspace...");
    setError("");

    try {
      await saveWorkspace({
        userId: user.uid,
        name: workspaceName.trim(),
        plan: "Free",
        members: [
          { email: user.email || "Account owner", role: "Admin" },
          ...(inviteEmail.trim()
            ? [{ email: inviteEmail.trim(), role: inviteRole }]
            : []),
        ],
      });
      setInviteEmail("");
      setStatus("Workspace saved.");
    } catch (workspaceError) {
      setError(
        workspaceError instanceof Error
          ? workspaceError.message
          : "Could not save workspace",
      );
      setStatus("");
    }
  }

  return (
    <main className="aurora-page min-h-screen px-5 py-6 text-[#13231f]">
      <ServiceMenu />
      <section className="mx-auto max-w-6xl">
        <Link
          href="/app"
          className="mb-4 inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8e8e1] bg-white/80 px-4 text-sm font-bold"
        >
          <ChevronLeft size={16} />
          Back dashboard
        </Link>

        <section className="premium-panel rounded-xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#3157d5]">
                Workspace
              </p>
              <h1 className="mt-2 text-4xl font-semibold">Team-ready structure</h1>
              <p className="mt-2 text-sm font-semibold text-[#4f635d]">
                Organize clients, members, and roles before full team invites are connected.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[#eef3ff] px-4 py-3 text-sm font-bold text-[#3157d5]">
              <Users size={18} />
              {workspaces.length} workspace
            </span>
          </div>

          <form onSubmit={createWorkspace} className="mt-5 grid gap-4 lg:grid-cols-4">
            <label className="grid gap-2 text-sm font-bold text-[#4f635d] lg:col-span-2">
              Workspace name
              <input
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
                className="h-11 rounded-lg border border-[#d8e8e1] px-3 outline-none focus:border-[#3157d5]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#4f635d]">
              Invite email
              <input
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="teammate@email.com"
                className="h-11 rounded-lg border border-[#d8e8e1] px-3 outline-none focus:border-[#3157d5]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#4f635d]">
              Role
              <select
                value={inviteRole}
                onChange={(event) =>
                  setInviteRole(event.target.value as "Admin" | "Member" | "Viewer")
                }
                className="h-11 rounded-lg border border-[#d8e8e1] px-3 outline-none focus:border-[#3157d5]"
              >
                <option>Member</option>
                <option>Viewer</option>
                <option>Admin</option>
              </select>
            </label>
            <button className="brand-gradient inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold lg:col-span-4">
              <Plus size={16} />
              Save workspace
            </button>
          </form>

          {status ? <p className="mt-3 text-sm font-bold text-[#08775d]">{status}</p> : null}
          {error ? <p className="mt-3 text-sm font-bold text-[#b42318]">{error}</p> : null}

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {workspaces.length ? (
              workspaces.map((workspace) => (
                <article key={workspace.id} className="rounded-xl border border-[#d8e8e1] bg-white p-4">
                  <p className="text-xl font-semibold">{workspace.name}</p>
                  <p className="mt-1 text-sm font-bold text-[#4f635d]">
                    Plan: {workspace.plan}
                  </p>
                  <div className="mt-4 grid gap-2">
                    {workspace.members.map((member) => (
                      <div
                        key={`${workspace.id}-${member.email}`}
                        className="flex items-center justify-between rounded-lg bg-[#eef8f2] px-3 py-2 text-sm font-bold"
                      >
                        <span>{member.email}</span>
                        <span>{member.role}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#d8e8e1] bg-white/70 p-8 text-center md:col-span-2">
                <Users className="mx-auto text-[#3157d5]" />
                <p className="mt-3 text-sm font-bold text-[#4f635d]">
                  Create one workspace for your own account, then later connect real invite emails.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
