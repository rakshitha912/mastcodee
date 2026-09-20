import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  BookOpen,
  Briefcase,
  Users,
  LogOut,
  Menu,
  X,
  Pencil,
  Plus,
  Save,
  Trash2,
  Search,
  Check,
  ListChecks,
  Download,
  FileSpreadsheet,
  ClipboardList,
  Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isSuperAdmin } from "@/lib/admin-auth";
import { AdminGuard } from "@/components/AdminGuard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard - MastCode" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  );
}

const AdminTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "applications", label: "Applications", icon: FileSpreadsheet },
  { id: "service-submissions", label: "Service Enquiries", icon: ClipboardList },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "internships", label: "Internships", icon: Briefcase },
  { id: "curriculum", label: "Curriculum", icon: ListChecks },
  { id: "training-programs", label: "Training Programs", icon: Briefcase },
  { id: "teams", label: "Teams", icon: Users },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loginNotice, setLoginNotice] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const isAdmin = await isSuperAdmin();
      if (!isAdmin) {
        await navigate({ to: "/auth/login" });
        return;
      }

      const notice = localStorage.getItem("mastcode-login-banner") || "You have been logged in.";
      setLoginNotice(notice);
      localStorage.removeItem("mastcode-login-banner");

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser(authUser || { email: localStorage.getItem("mastcode-admin-name") || "Rakshitha S" });
      setIsAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await navigate({ to: "/" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 border-r border-border bg-card shadow-sm transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <h1 className="font-display font-bold text-lg">MastCode Admin</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {AdminTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="rounded-lg border border-border bg-secondary/50 p-3 mb-4">
            <p className="text-xs font-medium text-muted-foreground">Administrator</p>
            <p className="text-sm font-semibold mt-1 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-30 border-b border-border bg-background">
          <div className="flex h-16 items-center justify-between px-6">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="font-display font-semibold text-lg capitalize">
              {AdminTabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <div></div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loginNotice && (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {loginNotice}
            </div>
          )}
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "applications" && <ApplicationsTab />}
          {activeTab === "service-submissions" && <ServiceSubmissionsTab />}
          {activeTab === "courses" && <CoursesTab />}
          {activeTab === "internships" && <InternshipsTab />}
          {activeTab === "curriculum" && <CurriculumTab />}
          {activeTab === "training-programs" && <TrainingProgramsTab />}
          {activeTab === "teams" && <TeamsTab />}
        </div>
      </main>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Dashboard Tab
function DashboardTab() {
  const [stats, setStats] = useState({
    total: 0,
    career: 0,
    placement: 0,
    institution: 0,
    website: 0,
    marketing: 0,
    newResponses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [serviceRows, applicationRows] = await Promise.all([
          fetchMysqlForms("services") as Promise<Array<{ service_type: string; status: string }>>,
          fetchMysqlForms("applications") as Promise<Array<{ id: string; status: string }>>,
        ]);

        setStats({
          total: serviceRows.length + applicationRows.length,
          career: serviceRows.filter((item) => item.service_type === "career_counselling").length,
          placement: serviceRows.filter((item) => item.service_type === "placement_assistance").length,
          institution: serviceRows.filter((item) => item.service_type === "institution_partnership").length,
          website: serviceRows.filter((item) => item.service_type === "website_development").length,
          marketing: serviceRows.filter((item) => item.service_type === "digital_marketing").length,
          newResponses: serviceRows.filter((item) => item.status === "New").length + applicationRows.filter((item) => item.status === "Applied").length,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Dashboard</h2>

      {loading ? (
        <p className="text-muted-foreground">Loading stats...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Applications" value={stats.total} />
          <StatCard label="Career Counselling" value={stats.career} />
          <StatCard label="Placement Applications" value={stats.placement} />
          <StatCard label="Institution Enquiries" value={stats.institution} />
          <StatCard label="Website Enquiries" value={stats.website} />
          <StatCard label="Digital Marketing" value={stats.marketing} />
          <StatCard label="New Responses" value={stats.newResponses} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

type ApplicationRecord = {
  id: string;
  position_title: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  resume_path: string | null;
  created_at: string;
  source?: string;
  location?: string | null;
  qualification?: string | null;
  skills?: string | null;
  experience?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  cover_letter?: string | null;
};

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

async function fetchMysqlForms(kind: "all" | "applications" | "services" = "all") {
  const response = await fetch(`/api/form-submissions?kind=${kind}`);
  const result = (await response.json().catch(() => null)) as { ok?: boolean; data?: unknown[]; error?: string } | null;
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || "Unable to load form submissions.");
  }
  return result.data || [];
}

async function updateMysqlFormStatus(id: string, status: string) {
  const response = await fetch("/api/form-submissions", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || "Unable to update status.");
  }
}

async function deleteMysqlFormSubmission(id: string) {
  const response = await fetch(`/api/form-submissions?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || "Unable to delete submission.");
  }
}

function ApplicationsTab() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchMysqlForms("applications");
      setApplications(data as ApplicationRecord[]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load applications.");
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  const exportExcel = () => {
    const headers = ["Applicant", "Email", "Phone", "Internship", "Status", "Applied date", "Resume path"];
    const rows = applications.map((application) => [
      application.full_name,
      application.email,
      application.phone,
      application.position_title,
      application.status,
      new Date(application.created_at).toLocaleString(),
      application.resume_path || "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mastcode-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadResume = async (path: string) => {
    setMessage(`Resume file is stored locally at ${path}`);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateMysqlFormStatus(id, status);
      setApplications((items) => items.map((item) => item.id === id ? { ...item, status } : item));
      setSelectedApplication((item) => item?.id === id ? { ...item, status } : item);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update status.");
    }
  };

  const deleteApplication = async (id: string) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteMysqlFormSubmission(id);
      setApplications((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete application.");
    }
  };

  const visibleApplications = applications
    .filter((application) => {
      const searchable = [application.full_name, application.email, application.phone, application.position_title, application.location].join(" ").toLowerCase();
      return searchable.includes(query.toLowerCase()) && (statusFilter === "All" || application.status === statusFilter);
    })
    .sort((a, b) => {
      const difference = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortOrder === "newest" ? -difference : difference;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold">Applications</h2>
          <p className="mt-1 text-sm text-muted-foreground">Review job and internship applications separately from service enquiries.</p>
        </div>
        <button type="button" onClick={exportExcel} disabled={!applications.length} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
          <Download className="h-4 w-4" /> Export Excel
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, phone, role, or location..." className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary">
          <option>All</option><option>Applied</option><option>Under Review</option><option>Shortlisted</option><option>Interview Scheduled</option><option>Selected</option><option>Rejected</option><option>Withdrawn</option>
        </select>
        <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")} className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary">
          <option value="newest">Newest First</option><option value="oldest">Oldest First</option>
        </select>
      </div>
      {message && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{message}</p>}
      {loading ? <p className="text-muted-foreground">Loading applications...</p> : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-border bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Applicant</th><th className="px-4 py-3">Internship</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Resume</th></tr>
            </thead>
            <tbody>
              {visibleApplications.map((application) => (
                <tr key={application.id} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-4"><p className="font-medium">{application.full_name}</p><p className="text-xs text-muted-foreground">{application.email}</p></td>
                  <td className="px-4 py-4">{application.position_title}</td>
                  <td className="px-4 py-4">{application.phone}</td>
                  <td className="px-4 py-4"><select value={application.status} onChange={(event) => void updateStatus(application.id, event.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-xs">{['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Withdrawn'].map((status) => <option key={status}>{status}</option>)}</select></td>
                  <td className="px-4 py-4"><div className="flex items-center gap-3"><button type="button" onClick={() => setSelectedApplication(application)} className="inline-flex items-center gap-1 text-primary hover:underline"><Eye className="h-4 w-4" /> View</button>{application.resume_path ? <button type="button" onClick={() => void downloadResume(application.resume_path!)} className="inline-flex items-center gap-1 text-primary hover:underline"><Download className="h-4 w-4" /> Download</button> : null}<button type="button" onClick={() => void deleteApplication(application.id)} className="text-red-600 hover:underline">Delete</button></div></td>
                </tr>
              ))}
              {!visibleApplications.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No applications match the current filters.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4" onClick={() => setSelectedApplication(null)}>
          <div role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4"><div><h3 className="font-display text-2xl font-bold">Application Details</h3><p className="mt-1 text-sm text-muted-foreground">{new Date(selectedApplication.created_at).toLocaleString()}</p></div><button type="button" onClick={() => setSelectedApplication(null)} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">Close</button></div>
            <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
              {Object.entries(selectedApplication).filter(([key]) => key !== "id" && key !== "resume_path").map(([key, value]) => <p key={key} className="break-words"><span className="capitalize text-muted-foreground">{key.replaceAll("_", " ")}:</span> {String(value ?? "-")}</p>)}
              {selectedApplication.resume_path && <button type="button" onClick={() => void downloadResume(selectedApplication.resume_path!)} className="inline-flex items-center gap-2 text-left text-primary hover:underline"><Download className="h-4 w-4" /> Download Resume</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type ServiceSubmission = {
  id: string;
  service_type: string;
  full_name: string;
  email: string;
  phone: string;
  payload: Record<string, unknown>;
  resume_path: string | null;
  status: string;
  created_at: string;
};

const serviceSubmissionSections = [
  ["career_counselling", "Career Counselling Requests"],
  ["placement_assistance", "Placement Assistance Applications"],
  ["institution_partnership", "Institution Partnership Enquiries"],
  ["website_development", "Website Service Enquiries"],
  ["digital_marketing", "Digital Marketing Enquiries"],
  ["contact_enquiry", "Contact Form Enquiries"],
  ["course_registration", "Course Registrations"],
  ["chatbot_lead", "MastCode Assistant Leads"],
] as const;

function ServiceSubmissionsTab() {
  const [submissions, setSubmissions] = useState<ServiceSubmission[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedSubmission, setSelectedSubmission] = useState<ServiceSubmission | null>(null);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await fetchMysqlForms("services");
      setSubmissions(data as ServiceSubmission[]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load service submissions.");
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadSubmissions();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateMysqlFormStatus(id, status);
      setSubmissions((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update status.");
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      await deleteMysqlFormSubmission(id);
      setSubmissions((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete submission.");
    }
  };

  const matches = (item: ServiceSubmission) => {
    const searchable = JSON.stringify(item).toLowerCase();
    return searchable.includes(query.toLowerCase()) && (statusFilter === "All" || item.status === statusFilter);
  };

  const downloadResume = async (path: string) => {
    setMessage(`Resume file is stored locally at ${path}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold">Service Enquiries</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review, search, update, and manage all service page submissions.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, phone, company, or institution..." className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary">
          <option>All</option><option>New</option><option>Contacted</option><option>In Progress</option><option>Completed</option>
        </select>
        <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")} className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary">
          <option value="newest">Newest First</option><option value="oldest">Oldest First</option>
        </select>
      </div>
      {message && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{message}</p>}
      {loading ? <p className="text-muted-foreground">Loading service submissions...</p> : serviceSubmissionSections.map(([type, title]) => {
        const sectionItems = submissions.filter((item) => item.service_type === type && matches(item)).sort((a, b) => {
          const difference = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          return sortOrder === "newest" ? -difference : difference;
        });
        return (
          <section key={type} className="space-y-4">
            <h3 className="font-display text-xl font-semibold">{title} <span className="text-sm font-normal text-muted-foreground">({sectionItems.length})</span></h3>
            <div className="space-y-3">
              {sectionItems.map((item) => (
                <details key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div><p className="font-semibold">{item.full_name}</p><p className="text-sm text-muted-foreground">{item.email} · {item.phone}</p></div>
                      <div className="flex items-center gap-3" onClick={(event) => event.stopPropagation()}>
                        <select value={item.status} onChange={(event) => void updateStatus(item.id, event.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-xs">
                          {['New', 'Contacted', 'In Progress', 'Completed'].map((status) => <option key={status}>{status}</option>)}
                        </select>
                        <button type="button" onClick={() => void deleteSubmission(item.id)} className="rounded-md border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                      </div>
                    </div>
                  </summary>
                  <button type="button" onClick={() => setSelectedSubmission(item)} className="mt-4 inline-flex items-center gap-2 rounded-md border border-primary/30 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10">View Details</button>
                </details>
              ))}
              {!sectionItems.length && <p className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">No submissions in this section.</p>}
            </div>
          </section>
        );
      })}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4" onClick={() => setSelectedSubmission(null)}>
          <div role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div><h3 className="font-display text-2xl font-bold">Submission Details</h3><p className="mt-1 text-sm text-muted-foreground">{new Date(selectedSubmission.created_at).toLocaleString()}</p></div>
              <button type="button" onClick={() => setSelectedSubmission(null)} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">Close</button>
            </div>
            <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
              <p><span className="text-muted-foreground">Name:</span> {selectedSubmission.full_name}</p>
              <p><span className="text-muted-foreground">Email:</span> {selectedSubmission.email}</p>
              <p><span className="text-muted-foreground">Phone:</span> {selectedSubmission.phone}</p>
              <p><span className="text-muted-foreground">Status:</span> {selectedSubmission.status}</p>
              {selectedSubmission.resume_path && <button type="button" onClick={() => void downloadResume(selectedSubmission.resume_path!)} className="inline-flex items-center gap-2 text-left text-primary hover:underline">Download Resume</button>}
              {Object.entries(selectedSubmission.payload || {}).map(([key, value]) => <p key={key} className="break-words"><span className="capitalize text-muted-foreground">{key.replaceAll("_", " ")}:</span> {String(value || "-")}</p>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Courses Tab
function CoursesTab() {
  return <ContentManager entity="courses" />;
}

function InternshipsTab() {
  return <ContentManager entity="internships" />;
}

function CurriculumTab() {
  const [courses, setCourses] = useState<any[]>([]);
  const [weeks, setWeeks] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("");
  const [editingWeek, setEditingWeek] = useState<any>(null);
  const [message, setMessage] = useState("");

  const loadCourses = async () => {
    const { data } = await supabase.from("courses").select("id, title, slug").order("title");
    const nextCourses = data || [];
    setCourses(nextCourses);
    if (!courseId && nextCourses[0]) setCourseId(nextCourses[0].id);
  };

  const loadWeeks = async (selectedCourseId = courseId) => {
    if (!selectedCourseId) return;
    const { data, error } = await (supabase as any)
      .from("course_weeks")
      .select("*")
      .eq("course_id", selectedCourseId)
      .order("week_number");
    if (error) setMessage(error.message);
    setWeeks(data || []);
  };

  useEffect(() => {
    void loadCourses();
  }, []);
  useEffect(() => {
    void loadWeeks();
  }, [courseId]);

  const blankWeek = () => ({
    course_id: courseId,
    week_number: weeks.length + 1,
    month_number: Math.ceil((weeks.length + 1) / 4),
    title: "",
    topics: "",
    practical_task: "",
    assignment: "",
    mini_project: "",
    expected_outcome: "",
  });
  const edit = (week: any) => setEditingWeek({ ...week, topics: (week.topics || []).join("\n") });
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...editingWeek,
      topics: editingWeek.topics
        .split("\n")
        .map((topic: string) => topic.trim())
        .filter(Boolean),
    };
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    const result = editingWeek.id
      ? await (supabase as any).from("course_weeks").update(payload).eq("id", editingWeek.id)
      : await (supabase as any).from("course_weeks").insert(payload);
    setMessage(result.error ? result.error.message : "Curriculum week saved.");
    if (!result.error) {
      setEditingWeek(null);
      await loadWeeks();
    }
  };
  const remove = async (id: string) => {
    if (!window.confirm("Delete this curriculum week?")) return;
    const { error } = await (supabase as any).from("course_weeks").delete().eq("id", id);
    setMessage(error ? error.message : "Curriculum week deleted.");
    if (!error) await loadWeeks();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Manage Curriculum</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only super_admin can add, edit, or delete course weeks.
        </p>
      </div>
      <select
        value={courseId}
        onChange={(event) => {
          setCourseId(event.target.value);
          setEditingWeek(null);
        }}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 sm:max-w-md"
      >
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>
      {message && (
        <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
          {message}
        </p>
      )}
      <div className="space-y-2">
        {weeks.map((week) => (
          <div
            key={week.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-3"
          >
            <span className="font-medium">
              Week {week.week_number}: {week.title}
            </span>
            <span className="flex gap-2">
              <button
                type="button"
                onClick={() => edit(week)}
                className="rounded-md border border-border px-3 py-1 text-sm hover:border-primary"
              >
                <Pencil className="mr-1 inline h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(week.id)}
                className="rounded-md border border-border px-3 py-1 text-sm text-destructive hover:border-destructive"
              >
                <Trash2 className="mr-1 inline h-3.5 w-3.5" />
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setEditingWeek(blankWeek())}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:brightness-110"
      >
        <Plus className="h-4 w-4" />
        Add Week
      </button>
      {editingWeek && (
        <form
          onSubmit={save}
          className="grid gap-4 rounded-xl border border-border bg-card/40 p-6 md:grid-cols-2"
        >
          <input
            required
            value={editingWeek.week_number}
            onChange={(event) =>
              setEditingWeek({ ...editingWeek, week_number: Number(event.target.value) })
            }
            type="number"
            min="1"
            max="24"
            placeholder="Week number"
            className="rounded-lg border border-border bg-background px-3 py-2"
          />
          <input
            required
            value={editingWeek.month_number}
            onChange={(event) =>
              setEditingWeek({ ...editingWeek, month_number: Number(event.target.value) })
            }
            type="number"
            min="1"
            max="6"
            placeholder="Month number"
            className="rounded-lg border border-border bg-background px-3 py-2"
          />
          {(
            ["title", "practical_task", "assignment", "mini_project", "expected_outcome"] as const
          ).map((field) => (
            <input
              key={field}
              required={field === "title" || field === "expected_outcome"}
              value={editingWeek[field] || ""}
              onChange={(event) => setEditingWeek({ ...editingWeek, [field]: event.target.value })}
              placeholder={field.replaceAll("_", " ")}
              className="rounded-lg border border-border bg-background px-3 py-2 md:col-span-2"
            />
          ))}
          <textarea
            required
            value={editingWeek.topics}
            onChange={(event) => setEditingWeek({ ...editingWeek, topics: event.target.value })}
            placeholder="Topics, one per line"
            rows={6}
            className="rounded-lg border border-border bg-background px-3 py-2 md:col-span-2"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"
            >
              <Save className="h-4 w-4" />
              Save Week
            </button>
            <button
              type="button"
              onClick={() => setEditingWeek(null)}
              className="rounded-lg border border-border px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Training Programs Tab
function TrainingProgramsTab() {
  return <ContentManager entity="training_programs" />;
}

// Teams Tab
function TeamsTab() {
  return <ContentManager entity="team_members" />;
}

type EntityName = "courses" | "internships" | "training_programs" | "team_members";
type ContentField = { name: string; label: string; type?: "text" | "textarea" | "number" | "file" };
type ContentRecord = {
  id?: string;
  title?: string;
  name?: string;
  status?: string;
  published?: boolean;
  published_at?: string | null;
  [key: string]: any;
};

const contentConfig: Record<EntityName, { title: string; fields: ContentField[] }> = {
  courses: {
    title: "Courses",
    fields: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug" },
      { name: "short_description", label: "Short description", type: "textarea" },
      { name: "full_description", label: "Course description", type: "textarea" },
      { name: "skills", label: "Technologies (comma-separated)" },
      { name: "category", label: "Category" },
      { name: "level", label: "Level" },
      { name: "duration", label: "Duration" },
      { name: "instructor", label: "Instructor" },
      { name: "price", label: "Price", type: "number" },
      { name: "thumbnail_path", label: "Course image", type: "file" },
    ],
  },
  internships: {
    title: "Internships",
    fields: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug" },
      { name: "department", label: "Department" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "responsibilities", label: "Responsibilities", type: "textarea" },
      { name: "requirements", label: "Requirements", type: "textarea" },
      { name: "skills", label: "Skills (comma-separated)" },
      { name: "duration", label: "Duration" },
      { name: "stipend", label: "Stipend" },
      { name: "location", label: "Location" },
      { name: "work_mode", label: "Work mode" },
      { name: "eligibility", label: "Eligibility", type: "textarea" },
      { name: "openings", label: "Openings", type: "number" },
      { name: "experience_level", label: "Experience level" },
    ],
  },
  training_programs: {
    title: "Training Programs",
    fields: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "category", label: "Category" },
      { name: "duration", label: "Duration" },
      { name: "mode", label: "Mode" },
      { name: "eligibility", label: "Eligibility" },
      { name: "price", label: "Price", type: "number" },
    ],
  },
  team_members: {
    title: "Team Members",
    fields: [
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "linkedin", label: "LinkedIn URL" },
      { name: "github", label: "GitHub URL" },
      { name: "photo_path", label: "Photo path" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
  },
};

function ContentManager({ entity }: { entity: EntityName }) {
  const config = contentConfig[entity];
  const [items, setItems] = useState<ContentRecord[]>([]);
  const [form, setForm] = useState<ContentRecord>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from(entity)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setMessage(error.message);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, [entity]);

  const startNew = () => {
    setEditingId(null);
    setForm(
      entity === "team_members"
        ? { display_order: 0 }
        : entity === "internships"
          ? { openings: 1, stipend: "Unpaid", status: "draft", featured: false }
          : { price: 0 },
    );
    setMessage("");
  };

  const editItem = (item: ContentRecord) => {
    if (!item.id) return;
    setEditingId(item.id);
    setForm({ ...item, skills: Array.isArray(item.skills) ? item.skills.join(", ") : item.skills });
    setMessage("");
  };

  const saveItem = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const payload = { ...form };
    if (entity === "courses" && typeof payload.skills === "string") {
      payload.skills = payload.skills
        .split(",")
        .map((skill: string) => skill.trim())
        .filter(Boolean);
    }
    if (entity === "internships" && typeof payload.skills === "string") {
      payload.skills = payload.skills
        .split(",")
        .map((skill: string) => skill.trim())
        .filter(Boolean);
    }
    if (entity === "team_members") {
      payload.published = Boolean(form.published);
    } else {
      payload.status = form.status || "draft";
      payload.published_at = payload.status === "published" ? new Date().toISOString() : null;
    }
    const result = editingId
      ? await (supabase as any).from(entity).update(payload).eq("id", editingId)
      : await (supabase as any).from(entity).insert(payload);
    if (result.error) setMessage(result.error.message);
    else {
      setMessage("Saved successfully.");
      setForm({});
      setEditingId(null);
      await loadItems();
    }
    setSaving(false);
  };

  const uploadCourseImage = async (file: File) => {
    if (entity !== "courses") return;
    setSaving(true);
    setMessage("");
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeSlug = String(form.slug || "course")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-");
    const path = `courses/${safeSlug}-${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) {
      setMessage(error.message);
    } else {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setForm((current) => ({ ...current, thumbnail_path: data.publicUrl }));
      setMessage("Course image uploaded. Save the course to publish this change.");
    }
    setSaving(false);
  };
  const deleteItem = async (item: ContentRecord) => {
    const label = item.title || item.name || "this item";
    if (!window.confirm(`Are you sure you want to delete ${label}?`)) return;
    const { error } = await (supabase as any).from(entity).delete().eq("id", item.id);
    if (error) setMessage(error.message);
    else await loadItems();
  };

  const togglePublished = async (item: ContentRecord) => {
    const isPublished = entity === "team_members" ? item.published : item.status === "published";
    const changes =
      entity === "team_members"
        ? { published: !isPublished }
        : {
            status: isPublished ? "draft" : "published",
            published_at: isPublished ? null : new Date().toISOString(),
          };
    const { error } = await (supabase as any).from(entity).update(changes).eq("id", item.id);
    if (error) setMessage(error.message);
    else await loadItems();
  };

  const visibleItems = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold">Manage {config.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Only super_admin mutations are allowed by Supabase RLS.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Add{" "}
          {entity === "team_members"
            ? "Member"
            : entity === "courses"
              ? "Course"
              : entity === "internships"
                ? "Internship"
                : "Program"}
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search content"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {(editingId || Object.keys(form).length > 0) && (
        <form
          onSubmit={saveItem}
          className="grid gap-4 rounded-xl border border-primary/30 bg-card p-5 shadow-sm sm:grid-cols-2"
        >
          {config.fields.map((field) => (
            <label key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {field.label}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  required={field.name === "title" || field.name === "name"}
                  value={form[field.name] || ""}
                  onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              ) : field.type === "file" ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(event) => {
                      const [file] = Array.from(event.target.files || []);
                      if (file) void uploadCourseImage(file);
                    }}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-primary"
                  />
                  {form.thumbnail_path && (
                    <p className="truncate text-xs text-muted-foreground">
                      Image ready: {String(form.thumbnail_path)}
                    </p>
                  )}
                </div>
              ) : (
                <input
                  required={
                    field.name === "title" || field.name === "name" || field.name === "slug"
                  }
                  type={field.type || "text"}
                  value={form[field.name] ?? ""}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      [field.name]:
                        field.type === "number" ? Number(event.target.value) : event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              )}
            </label>
          ))}
          <div className="flex gap-2 sm:col-span-2">
            <button
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({});
                setEditingId(null);
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          {message}
        </p>
      )}
      {loading ? (
        <p className="text-muted-foreground">Loading content...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => {
                const published =
                  entity === "team_members" ? item.published : item.status === "published";
                return (
                  <tr key={item.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-4 font-medium">{item.title || item.name}</td>
                    <td className="px-4 py-4">
                      <span className={published ? "text-emerald-400" : "text-amber-400"}>
                        {published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          title="Publish or unpublish"
                          onClick={() => togglePublished(item)}
                          className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
                        >
                          {published ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="text-xs">Publish</span>
                          )}
                        </button>
                        <button
                          title="Edit"
                          onClick={() => editItem(item)}
                          className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => deleteItem(item)}
                          className="rounded-md border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {visibleItems.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                    No content found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


