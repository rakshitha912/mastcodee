import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Database,
  Download,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  GraduationCap,
  Mail,
  Merge,
  Network,
  Search,
  UserRound,
  Workflow,
} from "lucide-react";
import { useState } from "react";

import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { Reveal } from "@/components/Reveal";
import { compressCurriculumTo90Days, fullStackCurriculum, group90DayCurriculumByWeek, type CourseWeekReport } from "@/lib/course-curricula";
import { dataAnalysisCurriculum } from "@/lib/data-analysis-curriculum";
import { machineLearningCurriculum } from "@/lib/machine-learning-curriculum";
import { artificialIntelligenceCurriculum } from "@/lib/artificial-intelligence-curriculum";
import { cloudComputingCurriculum } from "@/lib/cloud-computing-curriculum";
import { gitGithubCurriculum } from "@/lib/git-github-curriculum";
import { sqlDataManagementCurriculum } from "@/lib/sql-data-management-curriculum";
import { webDevelopmentCurriculum } from "@/lib/web-development-curriculum";
import { courseQuery, courseWeeksQuery, getCoursePrice, type CourseWeek } from "@/lib/queries";
import { socialMeta } from "@/lib/site";
import { submitJsonForm } from "@/lib/form-submit";

export const Route = createFileRoute("/courses/$slug")({
  loader: async ({ context, params }) => {
    const course = await context.queryClient.ensureQueryData(courseQuery(params.slug));
    if (!course) throw notFound();
    await context.queryClient.ensureQueryData(courseWeeksQuery(course.id));
    return { course };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Course unavailable - MastCode" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const c = loaderData.course;
    return {
      meta: socialMeta({
        title: `${c.title} - MastCode Course`,
        description: c.short_description,
        url: `/courses/${params.slug}`,
        type: "article",
      }),
      links: [{ rel: "canonical", href: `/courses/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: c.title,
            description: c.short_description,
            provider: { "@type": "Organization", name: "MastCode" },
          }),
        },
      ],
    };
  },
  component: CourseDetail,
});

const pythonCurriculum = [
  {
    month: 1,
    monthName: "Python Fundamentals",
    weeks: [
      {
        title: "Python Fundamentals",
        topics: ["Python introduction", "Environment setup", "Variables", "Data types"],
        practicalTask: "Install Python, configure an editor, and write your first script.",
        assignment: "Create a personal profile program using variables and basic data types.",
        miniProject: "CLI introduction card",
        expectedOutcome:
          "Run Python programs confidently and understand core values and variables.",
      },
      {
        title: "Programming Logic",
        topics: ["Operators", "Conditional statements", "Loops"],
        practicalTask: "Build programs that compare values and repeat tasks using loops.",
        assignment: "Create a menu-driven number utility.",
        miniProject: "Number guessing game",
        expectedOutcome: "Use control flow to model decisions and repeated work.",
      },
      {
        title: "Functions and scope",
        topics: ["Functions", "Arguments", "Return values", "Scope"],
        practicalTask: "Break a program into reusable functions with clear inputs and outputs.",
        assignment: "Write a collection of reusable unit-conversion functions.",
        miniProject: "Command-line calculator",
        expectedOutcome: "Design small, reusable functions and explain local versus global scope.",
      },
      {
        title: "Collections",
        topics: ["Lists", "Tuples", "Sets", "Dictionaries"],
        practicalTask: "Store, search, update, and transform structured collections of data.",
        assignment: "Build a contact book using dictionaries and lists.",
        miniProject: "Student records manager",
        expectedOutcome: "Choose the right built-in collection for a problem.",
      },
    ],
  },
  {
    month: 2,
    monthName: "Python & Data Handling",
    weeks: [
      {
        title: "Strings and text processing",
        topics: ["String methods", "Formatting", "Searching and slicing"],
        practicalTask: "Clean and transform user-entered text.",
        assignment: "Create a text analyzer that counts words, lines, and characters.",
        miniProject: "Command-line text formatter",
        expectedOutcome: "Manipulate and format text reliably.",
      },
      {
        title: "Files and exceptions",
        topics: ["File handling", "Reading and writing files", "Exception handling"],
        practicalTask: "Read data from a file and handle missing or invalid input gracefully.",
        assignment: "Build a CSV-style notes importer and exporter.",
        miniProject: "Log file analyzer",
        expectedOutcome: "Persist information and write programs that fail safely.",
      },
      {
        title: "Object-oriented programming",
        topics: ["Classes and objects", "Methods", "Inheritance", "Encapsulation"],
        practicalTask: "Model a real-world domain with classes and responsibilities.",
        assignment: "Create a small library management domain model.",
        miniProject: "Bank account simulator",
        expectedOutcome: "Organize larger programs using object-oriented design.",
      },
      {
        title: "Modules, packages, and environments",
        topics: ["Modules", "Packages", "Virtual environments", "pip"],
        practicalTask:
          "Split a project into modules and install a dependency in a virtual environment.",
        assignment: "Package one of your earlier projects into a reusable module.",
        miniProject: "Reusable utility package",
        expectedOutcome: "Maintain isolated, modular Python projects.",
      },
    ],
  },
  {
    month: 3,
    monthName: "Data Analysis & Visualization",
    weeks: [
      {
        title: "NumPy fundamentals",
        topics: ["Arrays", "Vectorized operations", "Indexing and shapes"],
        practicalTask: "Perform calculations on numerical arrays without manual loops.",
        assignment: "Analyze a small numerical dataset with NumPy.",
        miniProject: "Statistics calculator",
        expectedOutcome: "Use NumPy for fast numerical operations.",
      },
      {
        title: "Pandas fundamentals",
        topics: ["Series", "DataFrames", "Selecting and filtering data"],
        practicalTask: "Load a dataset and answer questions with DataFrame operations.",
        assignment: "Create a learner performance report with Pandas.",
        miniProject: "Dataset explorer",
        expectedOutcome: "Work productively with tabular data.",
      },
      {
        title: "Data cleaning",
        topics: ["Missing values", "Duplicates", "Type conversion", "Data validation"],
        practicalTask: "Prepare a messy dataset for analysis.",
        assignment: "Document and apply a repeatable cleaning pipeline.",
        miniProject: "Clean customer dataset",
        expectedOutcome: "Turn inconsistent raw data into analysis-ready data.",
      },
      {
        title: "Data analysis",
        topics: ["Grouping", "Aggregation", "Descriptive statistics", "Insights"],
        practicalTask: "Find trends and compare groups in a real dataset.",
        assignment: "Write a short analysis report with evidence-based conclusions.",
        miniProject: "Business insights report",
        expectedOutcome: "Translate data operations into useful decisions.",
      },
    ],
  },
  {
    month: 4,
    monthName: "SQL, APIs & Backend Development",
    weeks: [
      {
        title: "Matplotlib fundamentals",
        topics: ["Charts", "Labels and legends", "Subplots"],
        practicalTask: "Build clear charts from cleaned data.",
        assignment: "Create a chart pack for a business dataset.",
        miniProject: "Trend visualization report",
        expectedOutcome: "Communicate analysis through readable visualizations.",
      },
      {
        title: "Data visualization",
        topics: ["Choosing chart types", "Visual storytelling", "Presentation of findings"],
        practicalTask: "Turn a set of findings into a coherent visual story.",
        assignment: "Design a one-page data story with three visualizations.",
        miniProject: "Performance dashboard prototype",
        expectedOutcome: "Select effective visuals and explain the story behind them.",
      },
      {
        title: "SQL integration",
        topics: ["Database connections", "Queries from Python", "Loading results into Pandas"],
        practicalTask: "Query a relational database from a Python script.",
        assignment: "Build a report that combines SQL and Pandas operations.",
        miniProject: "Database reporting tool",
        expectedOutcome: "Connect Python analytics workflows to SQL data.",
      },
      {
        title: "APIs and external data",
        topics: ["HTTP requests", "JSON", "API authentication", "Error handling"],
        practicalTask: "Fetch and normalize data from a public API.",
        assignment: "Write an API client with validation and retry-friendly errors.",
        miniProject: "Live data collector",
        expectedOutcome: "Consume external services and work with JSON responses.",
      },
    ],
  },
  {
    month: 5,
    monthName: "Git, Testing & Projects",
    weeks: [
      {
        title: "Flask and FastAPI fundamentals",
        topics: ["Web app structure", "Routes", "Request and response handling"],
        practicalTask: "Create a small Python web service with multiple endpoints.",
        assignment: "Expose a data lookup service through an API.",
        miniProject: "Learning resources API",
        expectedOutcome: "Understand the building blocks of Python web applications.",
      },
      {
        title: "REST API development",
        topics: ["REST principles", "CRUD endpoints", "Validation", "Status codes"],
        practicalTask: "Design and implement a documented CRUD API.",
        assignment: "Add validation and consistent error responses.",
        miniProject: "Task management API",
        expectedOutcome: "Build an API that clients can use predictably.",
      },
      {
        title: "Git and GitHub",
        topics: ["Git/GitHub", "Branches", "Pull requests", "Collaboration"],
        practicalTask: "Use branches, commits, and pull requests for a project change.",
        assignment: "Publish a Python project with a useful README.",
        miniProject: "Open-source style repository",
        expectedOutcome: "Use a professional version-control workflow.",
      },
      {
        title: "Testing and debugging",
        topics: ["Testing", "Debugging", "Assertions", "Test organization"],
        practicalTask: "Find and fix defects using focused tests and a debugger.",
        assignment: "Add automated tests to the REST API project.",
        miniProject: "Tested service release",
        expectedOutcome: "Improve confidence and diagnose failures systematically.",
      },
    ],
  },
  {
    month: 6,
    monthName: "Machine Learning & Career Project",
    weeks: [
      {
        title: "Database project",
        topics: ["Schema design", "Persistence", "Queries", "Integration"],
        practicalTask: "Plan and implement the database layer for a complete application.",
        assignment: "Document the schema and key queries.",
        miniProject: "Python database application",
        expectedOutcome: "Deliver a working Python application backed by a database.",
      },
      {
        title: "Automation project",
        topics: ["Automation workflows", "Scheduling", "File and API integration", "Logging"],
        practicalTask: "Automate a repetitive workflow with safe logging.",
        assignment: "Measure the time saved and document setup steps.",
        miniProject: "Workflow automation tool",
        expectedOutcome: "Apply Python to a practical productivity problem.",
      },
      {
        title: "Machine learning introduction and end-to-end project",
        topics: [
          "Machine learning introduction",
          "Features and labels",
          "Model training",
          "Evaluation",
          "End-to-end ML project",
        ],
        practicalTask: "Train and evaluate a baseline model on a prepared dataset.",
        assignment: "Compare two models and explain the evaluation metric.",
        miniProject: "End-to-end prediction service",
        expectedOutcome: "Understand the ML workflow and communicate model results.",
      },
      {
        title: "Portfolio, presentation, and certification",
        topics: [
          "Portfolio project",
          "Final project",
          "Presentation",
          "Interview preparation",
          "Certification",
        ],
        practicalTask: "Polish the final project, README, demo, and portfolio entry.",
        assignment: "Present the project and complete a mock technical interview.",
        miniProject: "Career-ready Python portfolio",
        expectedOutcome:
          "Showcase a complete project and prepare for Python-focused opportunities.",
      },
    ],
  },
];

const pythonCurriculumDownload = `MastCode - Python Programming
Complete 6-Month Curriculum - Intensive 90-Day Program | Beginner to Advanced

${pythonCurriculum.map((month) => `Month ${month.month} - ${month.monthName}\n${month.weeks.map((week, index) => `Week ${(month.month - 1) * 4 + index + 1} - ${week.title}\n${week.topics.map((topic) => `- ${topic}`).join("\n")}`).join("\n")}`).join("\n\n")}`;

const fullStackCurriculumDownload = `MastCode - Full Stack Development
Complete 6-Month Curriculum - Intensive 90-Day Program | Beginner to Advanced

${fullStackCurriculum.map((month) => `Month ${month.month} - ${month.monthName}\n${month.weeks.map((week, index) => `Week ${(month.month - 1) * 4 + index + 1} - ${week.title}\n${week.topics.map((topic) => `- ${topic}`).join("\n")}`).join("\n")}`).join("\n\n")}`;

const dataAnalysisCurriculumDownload = `MastCode - Data Analysis
Complete 6-Month Curriculum - Intensive 90-Day Program | Beginner to Advanced

${dataAnalysisCurriculum.map((month) => `Month ${month.month} - ${month.monthName}\n${month.weeks.map((week, index) => `Week ${(month.month - 1) * 4 + index + 1} - ${week.title}\n${week.topics.map((topic) => `- ${topic}`).join("\n")}`).join("\n")}`).join("\n\n")}`;

const machineLearningCurriculumDownload = `MastCode - Machine Learning
Complete 6-Month Curriculum - Intensive 90-Day Program | Beginner to Advanced

${machineLearningCurriculum.map((month) => `Month ${month.month} - ${month.monthName}\n${month.weeks.map((week, index) => `Week ${(month.month - 1) * 4 + index + 1} - ${week.title}\n${week.topics.map((topic) => `- ${topic}`).join("\n")}`).join("\n")}`).join("\n\n")}`;

const artificialIntelligenceCurriculumDownload = `MastCode - Artificial Intelligence
Complete 6-Month Curriculum - Intensive 90-Day Program | Beginner to Advanced

${artificialIntelligenceCurriculum.map((month) => `Month ${month.month} - ${month.monthName}\n${month.weeks.map((week, index) => `Week ${(month.month - 1) * 4 + index + 1} - ${week.title}\n${week.topics.map((topic) => `- ${topic}`).join("\n")}`).join("\n")}`).join("\n\n")}`;

const cloudComputingCurriculumDownload = `MastCode - Cloud Computing
Complete 6-Month Curriculum - Intensive 90-Day Program | Beginner to Advanced

${cloudComputingCurriculum.map((month) => `Month ${month.month} - ${month.monthName}\n${month.weeks.map((week, index) => `Week ${(month.month - 1) * 4 + index + 1} - ${week.title}\n${week.topics.map((topic) => `- ${topic}`).join("\n")}`).join("\n")}`).join("\n\n")}`;

const gitGithubCurriculumDownload = `MastCode - Git & GitHub
1 Month | 4 Weeks | Beginner to Intermediate

${gitGithubCurriculum[0].weeks.map((week, index) => `Week ${index + 1} - ${week.title}\n${week.topics.map((topic) => `- ${topic}`).join("\n")}`).join("\n\n")}`;

const sqlDataManagementCurriculumDownload = `MastCode - SQL & Data Management Systems
2 Months | 8 Weeks | Beginner to Advanced

${sqlDataManagementCurriculum.map((month) => `Month ${month.month} - ${month.monthName}\n${month.weeks.map((week, index) => `Week ${(month.month - 1) * 4 + index + 1} - ${week.title}\n${week.topics.map((topic) => `- ${topic}`).join("\n")}`).join("\n")}`).join("\n\n")}`;

const webDevelopmentCurriculumDownload = `MastCode - Web Development
Complete 6-Month Curriculum - Intensive 90-Day Program | Beginner to Advanced

${webDevelopmentCurriculum.map((month) => `Month ${month.month} - ${month.monthName}\n${month.weeks.map((week, index) => `Week ${(month.month - 1) * 4 + index + 1} - ${week.title}\n${week.topics.map((topic) => `- ${topic}`).join("\n")}`).join("\n")}`).join("\n\n")}`;

function CourseDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(courseQuery(slug));
  const c = data!;
  const { data: storedWeeks } = useSuspenseQuery(courseWeeksQuery(c.id));
  const [enrollmentSubmitted, setEnrollmentSubmitted] = useState(false);
  const [enrollmentSubmitting, setEnrollmentSubmitting] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState("");
  const isPythonCourse = slug === "python-programming";
  const isFullStackCourse = slug === "full-stack-development";
  const isDataAnalysisCourse = slug === "data-analysis" || slug === "data-analytics";
  const isMachineLearningCourse = slug === "machine-learning";
  const isArtificialIntelligenceCourse = slug === "artificial-intelligence";
  const isCloudComputingCourse = slug === "cloud-computing";
  const isGitGithubCourse = slug === "git-github";
  const isSqlCourse = slug === "sql-database-management";
  const isWebDevelopmentCourse = slug === "web-development";
  const hasCurriculum =
    isPythonCourse ||
    isFullStackCourse ||
    isDataAnalysisCourse ||
    isMachineLearningCourse ||
    isArtificialIntelligenceCourse ||
    isCloudComputingCourse ||
    isGitGithubCourse ||
    isSqlCourse ||
    isWebDevelopmentCourse;
  const displayTitle = isDataAnalysisCourse
    ? "Data Analysis"
    : isSqlCourse
      ? "SQL & Data Management Systems"
      : c.title;
  const fallbackCurriculum = isPythonCourse
    ? pythonCurriculum
    : isDataAnalysisCourse
      ? dataAnalysisCurriculum
      : isMachineLearningCourse
        ? machineLearningCurriculum
        : isArtificialIntelligenceCourse
          ? artificialIntelligenceCurriculum
          : isCloudComputingCourse
            ? cloudComputingCurriculum
            : isGitGithubCourse
              ? gitGithubCurriculum
              : isSqlCourse
                ? sqlDataManagementCurriculum
                : isWebDevelopmentCourse
                  ? webDevelopmentCurriculum
                  : fullStackCurriculum;
  const curriculum = storedWeeks.length > 0 ? courseWeeksToMonths(storedWeeks) : fallbackCurriculum;
  const intensiveWeeks = group90DayCurriculumByWeek(compressCurriculumTo90Days(curriculum));
  const curriculumDownload = isPythonCourse
    ? pythonCurriculumDownload
    : isDataAnalysisCourse
      ? dataAnalysisCurriculumDownload
      : isMachineLearningCourse
        ? machineLearningCurriculumDownload
        : isArtificialIntelligenceCourse
          ? artificialIntelligenceCurriculumDownload
          : isCloudComputingCourse
            ? cloudComputingCurriculumDownload
            : isGitGithubCourse
              ? gitGithubCurriculumDownload
              : isSqlCourse
                ? sqlDataManagementCurriculumDownload
                : isWebDevelopmentCourse
                  ? webDevelopmentCurriculumDownload
                  : fullStackCurriculumDownload;
  const courseMeta = hasCurriculum
    ? [
        { icon: Clock, text: "90 Days" },
        {
          icon: GraduationCap,
          text: isGitGithubCourse ? "Beginner to Intermediate" : "Beginner to Advanced",
        },
        ...(isFullStackCourse ? [{ icon: null, text: "Training + Practical Projects" }] : []),
        ...(isDataAnalysisCourse
          ? [{ icon: null, text: "Excel | SQL | Python | Power BI" }]
          : []),
        ...(isMachineLearningCourse
          ? [{ icon: null, text: "Python | Scikit-learn | TensorFlow | NLP" }]
          : []),
        ...(isArtificialIntelligenceCourse
          ? [{ icon: null, text: "Python | GenAI | LLMs | RAG | AI Agents" }]
          : []),
        ...(isCloudComputingCourse
          ? [{ icon: null, text: "AWS | Azure | Linux | Docker | Kubernetes" }]
          : []),
        ...(isGitGithubCourse
          ? [{ icon: null, text: "Git | GitHub | Branching | Collaboration" }]
          : []),
        ...(isSqlCourse
          ? [{ icon: null, text: "SQL | MySQL | PostgreSQL | DBMS" }]
          : []),
        ...(isWebDevelopmentCourse
          ? [{ icon: null, text: "HTML | CSS | JavaScript | React | Node.js" }]
          : []),
      ]
    : [
        { icon: Clock, text: c.duration },
        { icon: GraduationCap, text: c.level },
        { icon: null, text: c.language },
        ...(c.instructor ? [{ icon: UserRound, text: c.instructor }] : []),
      ];

  return (
    <>
      <SiteNav />
      <main>
        <section className="border-b border-border bg-secondary">
          <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-20">
            <Reveal>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> All courses
              </Link>
            </Reveal>
            <Reveal delay={80}>
              <span className="mt-6 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {c.category}
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
                {displayTitle}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {isPythonCourse
                  ? "Master Python from the fundamentals to real-world development through hands-on coding, data analysis, APIs, automation, machine learning, projects, and career preparation."
                  : isFullStackCourse
                    ? "Master full-stack web development by learning how to design, develop, connect, secure, test, and deploy complete web applications."
                    : isDataAnalysisCourse
                      ? "Learn how to transform raw data into meaningful insights and business decisions. This 6-month program covers Excel, SQL, Python, NumPy, Pandas, data cleaning, statistics, exploratory data analysis, data visualization, Power BI, dashboards, and real-world analytics projects."
                      : isMachineLearningCourse
                        ? "Learn Machine Learning from the fundamentals to real-world AI application development. This 6-month program covers Python, statistics, data preprocessing, supervised and unsupervised learning, deep learning, NLP, model deployment, and end-to-end projects."
                        : isArtificialIntelligenceCourse
                          ? "Learn Artificial Intelligence from the fundamentals to building real-world AI applications. This 6-month program covers Python, machine learning, deep learning, NLP, computer vision, generative AI, LLMs, AI agents, deployment, and end-to-end projects."
                          : isCloudComputingCourse
                            ? "Learn cloud computing from the fundamentals to real-world cloud infrastructure and application deployment. This 6-month program covers Linux, networking, AWS, Azure, security, Docker, Kubernetes, CI/CD, Terraform, monitoring, and cloud deployment."
                            : isGitGithubCourse
                              ? "Learn Git and GitHub from the fundamentals to professional project collaboration. Manage code, track changes, collaborate with teams, resolve conflicts, and maintain portfolio-ready projects."
                              : isSqlCourse
                                ? "Learn SQL and Database Management Systems from the fundamentals to advanced database development. This program covers database design, queries, normalization, security, optimization, and real-world projects."
                                : "Learn modern web development from the fundamentals to building and deploying complete full-stack web applications through the complete 6-month curriculum delivered as an intensive 90-day program."}
              </p>
            </Reveal>
            <Reveal delay={160} className="mt-8 flex flex-wrap gap-3">
              {courseMeta.map((m) => (
                <span
                  key={m.text}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {m.icon && <m.icon className="h-4 w-4 text-accent" />} {m.text}
                </span>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1fr_320px]">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">Course Description</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              {(isPythonCourse ||
              isFullStackCourse ||
              isDataAnalysisCourse ||
              isMachineLearningCourse ||
              isArtificialIntelligenceCourse ||
              isCloudComputingCourse ||
              isGitGithubCourse ||
              isSqlCourse
                ? [
                    isPythonCourse
                      ? "Master Python from the fundamentals to real-world development through hands-on coding, data analysis, APIs, automation, machine learning, projects, and career preparation."
                      : isFullStackCourse
                        ? "Master full-stack web development by learning how to design, develop, connect, secure, test, and deploy complete web applications."
                        : isDataAnalysisCourse
                          ? "Learn how to transform raw data into meaningful insights and business decisions. Students work with practical datasets and complete portfolio-ready projects throughout the program."
                          : isMachineLearningCourse
                            ? "Learn Machine Learning from the fundamentals to real-world AI application development, model deployment, and end-to-end projects."
                            : isArtificialIntelligenceCourse
                              ? "Learn Artificial Intelligence from the fundamentals to building real-world AI applications. Students will build multiple practical projects and finish with a portfolio-ready AI capstone project."
                              : isCloudComputingCourse
                                ? "Learn cloud computing from the fundamentals to real-world cloud infrastructure and application deployment. Students will perform hands-on cloud labs and build portfolio-ready cloud projects."
                                : isSqlCourse
                                  ? "Learn SQL and Database Management Systems from the fundamentals to advanced database development. Students will work with practical databases and build a complete database management project."
                                  : isWebDevelopmentCourse
                                    ? "Learn modern web development from the fundamentals to building and deploying complete full-stack web applications. Students will complete multiple mini-projects and a final full-stack capstone project."
                                    : "Learn Git and GitHub from the fundamentals to professional project collaboration. Build a strong GitHub portfolio through practical workflows and projects.",
                  ]
                : c.full_description.split("\n").filter(Boolean)
              ).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <aside className="sticky top-24 rounded-xl border border-border bg-card p-7">
              <p className="font-display text-3xl font-bold">
                {getCoursePrice(c).toLocaleString("en-IN")}
              </p>
              {enrollmentSubmitted ? (
                <p className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">Your enrollment request was saved successfully. Our team will contact you shortly.</p>
              ) : (
                <form className="mt-6 space-y-3" onSubmit={async (event) => {
                  event.preventDefault();
                  setEnrollmentSubmitting(true);
                  setEnrollmentError("");
                  const form = new FormData(event.currentTarget);
                  try {
                    await submitJsonForm({
                    form_type: "course_registration",
                    service_type: "course_registration",
                    full_name: String(form.get("full_name") || ""),
                    email: String(form.get("email") || ""),
                    phone: String(form.get("phone") || ""),
                    course_id: c.id,
                    course_slug: c.slug,
                    course_title: c.title,
                    message: String(form.get("message") || ""),
                    });
                    setEnrollmentSubmitted(true);
                  } catch (error) {
                    setEnrollmentError(error instanceof Error ? error.message : "Unable to save your enrollment request.");
                  }
                  setEnrollmentSubmitting(false);
                }}>
                  <input name="full_name" required placeholder="Full Name" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" />
                  <input name="email" type="email" required placeholder="Email Address" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" />
                  <input name="phone" type="tel" required placeholder="Phone Number" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" />
                  <textarea name="message" rows={3} placeholder="Additional message" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" />
                  {enrollmentError && <p className="text-xs text-red-400">{enrollmentError}</p>}
                  <button type="submit" disabled={enrollmentSubmitting} className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60">{enrollmentSubmitting ? "Submitting..." : "Enroll now"}</button>
                </form>
              )}
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Mentor-led sessions, real project briefs, and placement support.
              </p>
            </aside>
          </Reveal>
        </section>

        {hasCurriculum && (
          <section className="mx-auto max-w-5xl space-y-10 px-6 pb-16">
            <Reveal>
              <h2 className="font-display text-3xl font-bold">
                {isGitGithubCourse ? "1-Month / 4-Week Curriculum" : "Complete 6-Month Curriculum — Intensive 90-Day Program"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {isGitGithubCourse
                  ? "A practical path from local commits to collaborative, portfolio-ready GitHub projects."
                  : "The complete existing curriculum compressed into an intensive 90-day program and presented as a week-wise report. Every original module, topic, practical task, project, assessment, deployment activity, and placement outcome is retained."}
              </p>
            </Reveal>
            {isGitGithubCourse && (
              <Reveal>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary">
                    <GitBranch className="h-4 w-4" /> Git workflow
                  </div>
                  <div className="grid gap-4 sm:grid-cols-5">
                    {[
                      { icon: GitCommitHorizontal, label: "Local Project" },
                      { icon: GitCommitHorizontal, label: "Commit" },
                      { icon: GitBranch, label: "Branch" },
                      { icon: GitPullRequest, label: "Pull Request" },
                      { icon: Merge, label: "Review & Merge" },
                    ].map((stage, index) => (
                      <div
                        key={stage.label}
                        className="animate-fade-in flex items-center gap-3 text-sm text-muted-foreground"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <stage.icon className="h-5 w-5 shrink-0 text-accent" />
                        <span>{stage.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
            {isSqlCourse && (
              <Reveal>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary">
                    <Database className="h-4 w-4" /> Database workflow
                  </div>
                  <div className="grid gap-4 sm:grid-cols-5">
                    {[
                      { icon: Network, label: "Application" },
                      { icon: Database, label: "SQL" },
                      { icon: Database, label: "Database" },
                      { icon: Search, label: "Query" },
                      { icon: GitCommitHorizontal, label: "Result" },
                    ].map((stage, index) => (
                      <div
                        key={stage.label}
                        className="animate-fade-in flex items-center gap-3 text-sm text-muted-foreground"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <stage.icon className="h-5 w-5 shrink-0 text-accent" />
                        <span>{stage.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
            {isWebDevelopmentCourse && (
              <Reveal>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary">
                    <Workflow className="h-4 w-4" /> Development pipeline
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {[
                      "HTML",
                      "CSS",
                      "JavaScript",
                      "React",
                      "Node.js",
                      "Database",
                      "API",
                      "Docker",
                      "Deployment",
                    ].map((stage, index) => (
                      <span
                        key={stage}
                        className="animate-fade-in inline-flex items-center gap-2"
                        style={{ animationDelay: `${index * 90}ms` }}
                      >
                        <span className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-primary">
                          {stage}
                        </span>
                        {index < 8 && <span className="text-accent">-&gt;</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
            <div className="space-y-6">
              {intensiveWeeks.map((week) => <WeeklyCurriculumItem key={week.week} week={week} />)}
            </div>
            <Reveal className="flex flex-wrap gap-3 pt-2">
              <a
                href="mailto:hello@mastcode.dev?subject=Python%20Programming%20Enrollment"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition-colors hover:bg-accent"
              >
                Enroll Now
              </a>
              <a
                href="mailto:hello@mastcode.dev?subject=Python%20Programming%20Question"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                <Mail className="h-4 w-4" /> Contact Us
              </a>
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(curriculumDownload)}`}
                download={`mastcode-${isPythonCourse ? "python" : isDataAnalysisCourse ? "data-analysis" : isMachineLearningCourse ? "machine-learning" : isArtificialIntelligenceCourse ? "artificial-intelligence" : isCloudComputingCourse ? "cloud-computing" : isGitGithubCourse ? "git-github" : "full-stack"}-curriculum.txt`}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                <Download className="h-4 w-4" /> Download Curriculum
              </a>
            </Reveal>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function WeeklyCurriculumItem({ week }: { week: CourseWeekReport }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Reveal>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-primary/40">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
          className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-primary/5"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{week.phase}</p>
            <h3 className="mt-1 font-display text-xl font-semibold">Week {week.week}: Days {week.startDay}-{week.endDay}</h3>
            <p className="mt-1 text-sm font-medium text-foreground">{week.title}</p>
            {!expanded && <p className="mt-1 text-sm text-muted-foreground">{week.topics.join(" | ")}</p>}
          </div>
          <ChevronDown className={`ml-4 h-5 w-5 shrink-0 text-accent transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
        {expanded && (
          <div className="animate-fade-in space-y-4 border-t border-border bg-secondary px-6 py-5">
            <div>
              <h4 className="text-sm font-semibold">Topics</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {week.topics.map((topic, index) => <li key={`${topic}-${index}`}>- {topic}</li>)}
              </ul>
            </div>
            <CurriculumListDetail label="Practical Tasks" values={week.practicalTasks} />
            <CurriculumListDetail label="Assignments" values={week.assignments} />
            <CurriculumListDetail label="Mini Projects" values={week.miniProjects} />
            <CurriculumListDetail label="Expected Outcomes" values={week.outcomes} />
          </div>
        )}
      </div>
    </Reveal>
  );
}

function CurriculumListDetail({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold">{label}</h4>
      <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
        {values.map((value, index) => <li key={`${label}-${index}`}>{value}</li>)}
      </ul>
    </div>
  );
}

function courseWeeksToMonths(weeks: CourseWeek[]) {
  const monthNames = ["", "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"];
  return Array.from(new Set(weeks.map((week) => week.month_number)))
    .sort()
    .map((monthNumber) => ({
      month: monthNumber,
      monthName: monthNames[monthNumber],
      weeks: weeks
        .filter((week) => week.month_number === monthNumber)
        .map((week) => ({
          title: week.title,
          topics: week.topics,
          practicalTask: week.practical_task || undefined,
          assignment: week.assignment || undefined,
          miniProject: week.mini_project || undefined,
          expectedOutcome: week.expected_outcome,
        })),
    }));
}

function CurriculumDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h5 className="text-sm font-semibold">{label}</h5>
      <p className="mt-1 text-sm text-muted-foreground">{value}</p>
    </div>
  );
}


