import { createFileRoute } from "@tanstack/react-router";
import { Award, FolderGit2, Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, SkillBar, SkillTag } from "@/components/skillbridge/primitives";
import { useAppState } from "@/context/app-state";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [
      { title: "Student Profile — SkillBridge" },
      {
        name: "description",
        content:
          "Manage your academic details, skills, projects, certifications and career interests used for internship matching.",
      },
      { property: "og:title", content: "Student Profile — SkillBridge" },
      {
        property: "og:description",
        content: "The academic and skill profile behind every SkillBridge match.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, updateProfile } = useAppState();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const save = () => {
    updateProfile(draft);
    setEditing(false);
    toast.success("Profile updated");
  };

  const fields = [
    ["name", "Full name"],
    ["college", "College"],
    ["degree", "Degree"],
    ["branch", "Branch"],
    ["year", "Year"],
    ["email", "Email"],
  ] as const;

  return (
    <>
      <PageHeader
        title="Profile"
        description="Everything here feeds the skill-matching engine."
        action={
          editing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(false)}>
                <X className="size-4" /> Cancel
              </Button>
              <Button onClick={save}>
                <Save className="size-4" /> Save
              </Button>
            </div>
          ) : (
            <Button onClick={startEdit}>
              <Pencil className="size-4" /> Edit profile
            </Button>
          )
        }
      />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 font-display text-lg font-semibold text-primary">
            {profile.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-semibold text-foreground">
              {profile.name}
            </h2>
            <p className="truncate text-sm text-muted-foreground">
              {profile.degree} · {profile.branch} · {profile.year}
            </p>
          </div>
        </div>

        {editing ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {fields.map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={draft[key]}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                />
              </div>
            ))}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                rows={3}
                value={draft.about}
                onChange={(e) => setDraft({ ...draft, about: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{profile.about}</p>
            <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map(([key, label]) => (
                <div key={key} className="min-w-0">
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 truncate text-sm font-medium text-foreground">
                    {profile[key]}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-foreground">Skills</h2>
          <div className="mt-5 space-y-4">
            {profile.skills.map((s) => (
              <SkillBar key={s.name} name={s.name} score={s.score} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-foreground">Career interests</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <SkillTag key={i}>{i}</SkillTag>
            ))}
          </div>
          <h3 className="mt-8 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <Award className="size-4 text-primary" /> Certifications
          </h3>
          <ul className="mt-4 divide-y divide-border">
            {profile.certifications.map((c) => (
              <li key={c.title} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.issuer}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{c.year}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <FolderGit2 className="size-4 text-primary" /> Projects
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {profile.projects.map((p) => (
            <article key={p.title} className="rounded-2xl border border-border bg-background p-5">
              <h3 className="font-display text-base font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <SkillTag key={t} muted>
                    {t}
                  </SkillTag>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
