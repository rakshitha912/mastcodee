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
  isAssessment?: boolean;
  isMockInterview?: boolean;
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
  assessmentTopics: string[];
  assessmentTask: string;
  mockInterview?: string;
  scheduleLabel: string;
  restDayNote: string;
}

const coursePhases = [
  { start: 1, end: 30, label: "Days 1-30: Foundations and Core Skills" },
  { start: 31, end: 60, label: "Days 31-60: Applied Skills and Mid-Course Interview" },
  { start: 61, end: 80, label: "Days 61-80: Advanced Topics and Projects" },
  { start: 81, end: 100, label: "Days 81-100: Capstone, Review, and Final Assessment" },
];

function phaseForDay(day: number) {
  return coursePhases.find((phase) => day >= phase.start && day <= phase.end)?.label ?? coursePhases[0].label;
}

function splitTopics(topics: string[], parts: number) {
  return Array.from({ length: parts }, (_, index) => {
    const start = Math.floor((index * topics.length) / parts);
    const end = Math.floor(((index + 1) * topics.length) / parts);
    return topics.slice(start, Math.max(end, start + 1));
  });
}

export function build100DayCurriculum(curriculum: CourseMonth[]): CourseDay[] {
  const weeks = curriculum.flatMap((month) => month.weeks);
  const totalClassDays = 100;
  const weeklyTestCount = Math.ceil(totalClassDays / 6);
  const lessonDayCount = totalClassDays - weeklyTestCount;
  const lessonDays = weeks.flatMap((week, weekIndex) => {
    const firstDay = Math.floor((weekIndex * lessonDayCount) / weeks.length);
    const afterLastDay = Math.floor(((weekIndex + 1) * lessonDayCount) / weeks.length);
    const daysForModule = afterLastDay - firstDay;
    const topicGroups = splitTopics(week.topics, daysForModule);

    return topicGroups.map((topics, dayIndex): Omit<CourseDay, "day" | "phase"> => {
      const isModuleEnd = dayIndex === topicGroups.length - 1;
      return {
        title: week.title,
        topics,
        practicalTask: isModuleEnd ? week.practicalTask : undefined,
        assignment: isModuleEnd ? week.assignment : undefined,
        miniProject: isModuleEnd ? week.miniProject : undefined,
        expectedOutcome: isModuleEnd ? week.expectedOutcome : `Build toward the ${week.expectedOutcome.toLowerCase()}`,
      };
    });
  });

  const days: CourseDay[] = [];
  let lessonIndex = 0;
  for (let weekIndex = 0; days.length < totalClassDays; weekIndex += 1) {
    const lessonsThisWeek = Math.min(5, lessonDays.length - lessonIndex);
    const weekLessons: CourseDay[] = [];

    for (let lessonInWeek = 0; lessonInWeek < lessonsThisWeek; lessonInWeek += 1) {
      const lesson = lessonDays[lessonIndex++];
      const dayNumber = days.length + 1;
      const isMockInterview = dayNumber === 50;
      const interviewTask = "Complete a timed mock interview covering the skills learned so far, then review feedback and set improvement goals.";
      const day: CourseDay = {
        ...lesson,
        day: dayNumber,
        phase: phaseForDay(dayNumber),
        title: isMockInterview ? `Mid-Course Mock Interview: ${lesson.title}` : lesson.title,
        topics: isMockInterview ? [...lesson.topics, "Explain and demonstrate course concepts in a mock interview"] : lesson.topics,
        practicalTask: isMockInterview ? [lesson.practicalTask, interviewTask].filter(Boolean).join(" ") : lesson.practicalTask,
        assignment: isMockInterview ? [lesson.assignment, "Record interview feedback and a focused improvement plan."].filter(Boolean).join(" ") : lesson.assignment,
        expectedOutcome: isMockInterview ? "Practice explaining technical decisions and receive actionable midpoint feedback." : lesson.expectedOutcome,
        isMockInterview,
      };
      days.push(day);
      weekLessons.push(day);
    }

    const assessmentDay = days.length + 1;
    const assessmentTopics = Array.from(new Set(weekLessons.flatMap((day) => day.topics)));
    days.push({
      day: assessmentDay,
      phase: phaseForDay(assessmentDay),
      title: `Week ${weekIndex + 1} Test`,
      topics: assessmentTopics,
      practicalTask: "Take a short written quiz and hands-on test on this week's lessons, then review and correct missed questions.",
      assignment: "Complete test corrections and note topics to revisit before the next week's classes.",
      expectedOutcome: "Check understanding of the week's material and identify what needs more practice.",
      isAssessment: true,
    });
  }

  return days;
}

export function group100DayCurriculumByWeek(days: CourseDay[]): CourseWeekReport[] {
  const reports: CourseWeekReport[] = [];

  for (let index = 0; index < days.length; index += 6) {
    const weekDays = days.slice(index, index + 6);
    const assessment = weekDays[weekDays.length - 1];
    const lessonDays = weekDays.slice(0, -1);
    const mockInterview = lessonDays.find((day) => day.isMockInterview);
    reports.push({
      week: reports.length + 1,
      startDay: weekDays[0].day,
      endDay: weekDays[weekDays.length - 1].day,
      phase: weekDays[0].phase,
      title: Array.from(new Set(lessonDays.map((day) => day.title))).join(" + "),
      topics: lessonDays.flatMap((day) => day.topics),
      practicalTasks: lessonDays.flatMap((day) => day.practicalTask ? [day.practicalTask] : []),
      assignments: lessonDays.flatMap((day) => day.assignment ? [day.assignment] : []),
      miniProjects: lessonDays.flatMap((day) => day.miniProject ? [day.miniProject] : []),
      outcomes: Array.from(new Set(lessonDays.map((day) => day.expectedOutcome))),
      assessmentTopics: assessment.topics,
      assessmentTask: assessment.practicalTask ?? "Complete this week's test and review the results.",
      mockInterview: mockInterview ? "Complete the scheduled midpoint mock interview and record interviewer feedback." : undefined,
      scheduleLabel: lessonDays.length === 5
        ? "5 class days | Day 6 test | Day 7 rest"
        : `${lessonDays.length} final class days | Final test | Day 7 rest`,
      restDayNote: "Day 7: Rest day. No classes or required coursework.",
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