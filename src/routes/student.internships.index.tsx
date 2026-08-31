import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, PageHeader } from "@/components/skillbridge/primitives";
import { InternshipCard } from "@/components/skillbridge/internship-card";
import { useAppState } from "@/context/app-state";

export const Route = createFileRoute("/student/internships/")({
  head: () => ({
    meta: [
      { title: "Internship Matches — AcadIn" },
      {
        name: "description",
        content:
          "Browse internships ranked by skill match, filter by work type and search across companies and roles.",
      },
      { property: "og:title", content: "Internship Matches — AcadIn" },
      {
        property: "og:description",
        content: "Roles ranked against your assessed skill profile.",
      },
    ],
  }),
  component: InternshipsPage,
});

function InternshipsPage() {
  const { internships } = useAppState();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return internships
      .filter((i) => (type === "all" ? true : i.type === type))
      .filter((i) =>
        q
          ? [i.title, i.company, i.location, ...i.requiredSkills]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true,
      )
      .sort((a, b) => b.match - a.match);
  }, [internships, query, type]);

  return (
    <>
      <PageHeader
        title="Internships"
        description="Ranked by how closely each role matches your assessed skills."
      />

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role, company or skill"
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Work type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="On-site">On-site</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {results.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((i) => (
            <InternshipCard key={i.id} internship={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No internships found"
          description="Try a different search term or clear the work type filter."
        />
      )}
    </>
  );
}
