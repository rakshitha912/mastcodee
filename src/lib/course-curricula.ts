export interface CourseWeek {
  title: string;
  topics: string[];
  practicalTask?: string;
  assignment?: string;
  miniProject?: string;
  expectedOutcome: string;
}

export interface CourseMonth {
  month: number;
  monthName: string;
  weeks: CourseWeek[];
}

export interface CourseDay {
  day: number;
  phase: string;
  title: string;
  topics: string[];
  practicalTask?: string;
  assignment?: string;
  miniProject?: string;
  expectedOutcome: string;
}

export interface CourseWeekReport {
  week: number;
  startDay: number;
  endDay: number;
  phase: string;
  title: string;
  topics: string[];
  practicalTasks: string[];
  assignments: string[];
  miniProjects: string[];
  outcomes: string[];
}

const intensive90DayPhases = [
  { start: 1, end: 30, label: "Days 1-30: Foundation + Core Development" },
  { start: 31, end: 60, label: "Days 31-60: Advanced Development + Full-Stack Skills" },
  { start: 61, end: 75, label: "Days 61-75: Advanced Concepts + Real-World Development" },
  { start: 76, end: 85, label: "Days 76-85: Major Project + Deployment + Testing" },
  { start: 86, end: 90, label: "Days 86-90: Resume + Mock Interviews + Placement Preparation" },
];

function phaseForDay(day: number) {
  return intensive90DayPhases.find((phase) => day >= phase.start && day <= phase.end)?.label ?? intensive90DayPhases[0].label;
}

function splitTopics(topics: string[], parts: number) {
  return Array.from({ length: parts }, (_, index) => {
    const start = Math.floor((index * topics.length) / parts);
    const end = Math.floor(((index + 1) * topics.length) / parts);
    return topics.slice(start, Math.max(end, start + 1));
  });
}

export function compressCurriculumTo90Days(curriculum: CourseMonth[]): CourseDay[] {
  const weeks = curriculum.flatMap((month) => month.weeks);
  const days: CourseDay[] = [];
  let dayNumber = 1;

  weeks.forEach((week, weekIndex) => {
    const daysForWeek = weekIndex % 4 === 3 ? 3 : 4;
    const topicGroups = splitTopics(week.topics, daysForWeek);

    topicGroups.forEach((topics, dayIndex) => {
      const isWeekEnd = dayIndex === topicGroups.length - 1;
      days.push({
        day: dayNumber,
        phase: phaseForDay(dayNumber),
        title: `${week.title}${daysForWeek > 1 ? ` - Intensive Day ${dayIndex + 1} of ${daysForWeek}` : ""}`,
        topics,
        practicalTask: isWeekEnd ? week.practicalTask : undefined,
        assignment: isWeekEnd ? week.assignment : undefined,
        miniProject: isWeekEnd ? week.miniProject : undefined,
        expectedOutcome: isWeekEnd ? week.expectedOutcome : `Build toward the ${week.expectedOutcome.toLowerCase()}`,
      });
      dayNumber += 1;
    });
  });

  return days;
}

export function group90DayCurriculumByWeek(days: CourseDay[]): CourseWeekReport[] {
  const reports: CourseWeekReport[] = [];

  for (let index = 0; index < days.length; index += 7) {
    const weekDays = days.slice(index, index + 7);
    reports.push({
      week: reports.length + 1,
      startDay: weekDays[0].day,
      endDay: weekDays[weekDays.length - 1].day,
      phase: weekDays[0].phase,
      title: Array.from(new Set(weekDays.map((day) => day.title.replace(/ - Intensive Day \d+ of \d+$/, "")))).join(" + "),
      topics: weekDays.flatMap((day) => day.topics),
      practicalTasks: weekDays.flatMap((day) => day.practicalTask ? [day.practicalTask] : []),
      assignments: weekDays.flatMap((day) => day.assignment ? [day.assignment] : []),
      miniProjects: weekDays.flatMap((day) => day.miniProject ? [day.miniProject] : []),
      outcomes: Array.from(new Set(weekDays.map((day) => day.expectedOutcome))),
    });
  }

  return reports;
}

export const fullStackCurriculum: CourseMonth[] = [
  {
    month: 1,
    monthName: "Web Development Fundamentals",
    weeks: [
      { title: "HTML Fundamentals", topics: ["Introduction to web development", "How websites work", "HTML document structure", "Elements and attributes", "Headings and paragraphs", "Links", "Images", "Lists", "Tables", "Forms"], practicalTask: "Build a personal profile webpage.", expectedOutcome: "Create structured web pages with semantic HTML." },
      { title: "Advanced HTML & Forms", topics: ["Semantic HTML", "Forms and input types", "Form validation", "Tables", "Audio and video", "Accessibility basics", "SEO-friendly HTML", "Page structure"], practicalTask: "Build a registration/contact form.", expectedOutcome: "Build accessible, search-friendly forms and page structures." },
      { title: "CSS Fundamentals", topics: ["CSS introduction", "Selectors", "Colors", "Fonts", "Text styling", "Box model", "Margin and padding", "Borders", "Backgrounds", "Units"], practicalTask: "Style the Week 2 webpage professionally.", expectedOutcome: "Apply a consistent visual system with maintainable CSS." },
      { title: "Responsive Web Design", topics: ["Flexbox", "CSS Grid", "Positioning", "Media queries", "Responsive layouts", "Mobile-first design", "Responsive navigation", "Website optimization"], miniProject: "Build a fully responsive landing page.", expectedOutcome: "Create layouts that work cleanly across mobile and desktop." },
    ],
  },
  {
    month: 2,
    monthName: "JavaScript & React",
    weeks: [
      { title: "JavaScript Fundamentals", topics: ["JavaScript introduction", "Variables", "Data types", "Operators", "Conditional statements", "Loops", "Functions", "Scope"], practicalTask: "Build interactive JavaScript exercises.", expectedOutcome: "Use JavaScript fundamentals to add behavior to web pages." },
      { title: "JavaScript Advanced Concepts", topics: ["Arrays", "Objects", "Array methods", "Destructuring", "Spread/rest operators", "DOM manipulation", "Events", "Form handling"], miniProject: "Build an interactive task manager.", expectedOutcome: "Manipulate the DOM and manage user interactions confidently." },
      { title: "Modern JavaScript & APIs", topics: ["ES6+", "Modules", "Promises", "Async/await", "Error handling", "JSON", "Fetch API", "Working with external APIs"], practicalTask: "Build an API-powered application.", expectedOutcome: "Consume external APIs with modern asynchronous JavaScript." },
      { title: "React Fundamentals", topics: ["React introduction", "Project setup", "Components", "JSX", "Props", "State", "Events", "Conditional rendering", "Lists"], miniProject: "Build a React-based portfolio/dashboard.", expectedOutcome: "Build maintainable React interfaces from reusable components." },
    ],
  },
  {
    month: 3,
    monthName: "React & Backend Development",
    weeks: [
      { title: "React Development", topics: ["React component architecture", "useState", "useEffect", "Forms", "Controlled components", "Reusable components", "Component communication"], practicalTask: "Build a multi-section React application.", expectedOutcome: "Compose reusable React features and manage component state." },
      { title: "React Routing & State", topics: ["React Router", "Navigation", "Dynamic routes", "Route parameters", "Nested routes", "Context API", "Global state management"], miniProject: "Build a multi-page React application.", expectedOutcome: "Create navigable applications with shared state." },
      { title: "Node.js Fundamentals", topics: ["Introduction to Node.js", "Node.js runtime", "npm", "Package management", "Modules", "File system", "Environment variables", "Creating a basic server"], practicalTask: "Build a simple Node.js server.", expectedOutcome: "Understand server-side JavaScript and Node project structure." },
      { title: "Express.js", topics: ["Express introduction", "Application structure", "Routes", "Middleware", "Request/response", "Error handling", "REST API basics", "API project structure"], miniProject: "Build a basic Express REST API.", expectedOutcome: "Build organized backend routes and middleware." },
    ],
  },
  {
    month: 4,
    monthName: "Databases & Authentication",
    weeks: [
      { title: "SQL Fundamentals", topics: ["Introduction to databases", "Relational databases", "Tables", "Primary keys", "Foreign keys", "SELECT", "INSERT", "UPDATE", "DELETE", "WHERE", "ORDER BY"], practicalTask: "Create a student management database.", expectedOutcome: "Design and query relational data with SQL." },
      { title: "Advanced SQL & PostgreSQL", topics: ["PostgreSQL introduction", "Database creation", "Relationships", "JOINs", "GROUP BY", "Aggregate functions", "Constraints", "Indexes", "Database design"], miniProject: "Build a PostgreSQL-backed application.", expectedOutcome: "Model robust PostgreSQL schemas and write useful queries." },
      { title: "Backend + Database Integration", topics: ["Connecting Node.js with PostgreSQL", "Database queries from Express", "CRUD operations", "Data validation", "Error handling", "Environment variables", "Database security"], assignment: "Create a complete CRUD REST API connected to PostgreSQL.", expectedOutcome: "Persist application data through a secure backend API." },
      { title: "Authentication & Authorization", topics: ["Authentication concepts", "User registration", "Login", "Password hashing", "JWT authentication", "Protected routes", "Authorization", "User roles", "Logout", "Secure authentication practices"], miniProject: "Build a secure login and registration system.", expectedOutcome: "Protect users, routes, and roles using secure authentication patterns." },
    ],
  },
  {
    month: 5,
    monthName: "Full-Stack Integration & Docker",
    weeks: [
      { title: "Connecting Frontend & Backend", topics: ["React + Express integration", "API requests", "Fetch/Axios", "Loading states", "Error handling", "Forms and API submission", "CRUD from frontend"], assignment: "Connect a React frontend with the Express backend.", expectedOutcome: "Wire a frontend to real backend data and actions." },
      { title: "Complete Full-Stack Application", topics: ["Frontend architecture", "Backend architecture", "API integration", "Authentication integration", "PostgreSQL integration", "Protected pages", "User dashboard"], miniProject: "Build a complete authenticated full-stack application.", expectedOutcome: "Deliver a coherent application across frontend, backend, and database." },
      { title: "Git & GitHub", topics: ["Git fundamentals", "Repository creation", "Commits", "Branches", "Merging", "Pull requests", ".gitignore", "GitHub repositories", "Collaboration workflow"], practicalTask: "Upload the complete project to GitHub.", expectedOutcome: "Use professional version control and collaboration workflows." },
      { title: "Docker & Containerization", topics: ["Introduction to Docker", "Images", "Containers", "Dockerfile", "Docker Compose", "Environment variables", "Containerizing frontend", "Containerizing backend", "Running PostgreSQL with Docker"], assignment: "Dockerize the full-stack application.", expectedOutcome: "Package and run the full stack consistently across environments." },
    ],
  },
  {
    month: 6,
    monthName: "Deployment & Capstone",
    weeks: [
      { title: "Deployment & Production", topics: ["Production vs development", "Build process", "Environment configuration", "Frontend deployment", "Backend deployment", "Database deployment", "Domain basics", "HTTPS", "Production environment variables"], practicalTask: "Deploy a full-stack application.", expectedOutcome: "Ship a secure application to a production environment." },
      { title: "Advanced Full-Stack Features", topics: ["API security", "Input validation", "Error handling", "Performance optimization", "Pagination", "Search", "Filtering", "File uploads", "Security best practices"], practicalTask: "Add advanced features to the application.", expectedOutcome: "Improve a production application with secure, useful features." },
      { title: "Full-Stack Capstone Development", topics: ["Project idea selection", "Requirement analysis", "UI/UX planning", "Database design", "Frontend development", "Backend development", "API development", "Authentication", "Database integration", "GitHub repository", "Testing"], assignment: "Develop a portfolio capstone such as an e-commerce platform, LMS, job portal, booking platform, or student career platform.", expectedOutcome: "Plan and build a complete portfolio-grade product." },
      { title: "Final Project, Deployment & Career Preparation", topics: ["Complete final project", "Testing", "Bug fixing", "Security review", "Docker setup", "Production deployment", "GitHub documentation", "Project presentation", "Resume project explanation", "Portfolio preparation", "Technical interview preparation", "Mock interview", "Final evaluation", "Certification"], practicalTask: "Present and defend the deployed capstone project.", expectedOutcome: "Graduate with a documented, deployed project and interview-ready portfolio." },
    ],
  },
];