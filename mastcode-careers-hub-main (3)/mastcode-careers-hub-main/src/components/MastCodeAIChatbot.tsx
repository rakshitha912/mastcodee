import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, CheckCircle2, ChevronDown, Mail, MessageSquareText, Minimize2, RefreshCw, SendHorizonal, ShieldAlert, Sparkles, X } from "lucide-react";
import { submitJsonForm } from "@/lib/form-submit";

const CONTACT_EMAIL = "rakshithamastcode@gmail.com";
const MASTCODE_LOGO_URL = "/og/mast_code_logo_2_corrected.png";
const DEFAULT_SUGGESTIONS = [
  "Courses & Training",
  "Career Guidance",
  "Jobs & Internships",
  "College Partnerships",
  "Business Services",
  "Website Development",
  "Digital Marketing",
  "Contact MastCode",
] as const;

const COURSE_SUGGESTIONS = [
  "Full Stack Development",
  "Web Development",
  "Python Programming",
  "SQL & Database Management",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Analytics",
  "Cloud Computing",
  "Git & GitHub",
] as const;

const COMPACT_SUGGESTION_LABELS: Record<string, string> = {
  "Full Stack Development": "Full Stack",
  "Web Development": "Web Dev",
  "Python Programming": "Python",
  "SQL & Database Management": "SQL & DB",
  "Artificial Intelligence": "AI",
  "Machine Learning": "ML",
  "Data Analytics": "Data",
  "Cloud Computing": "Cloud",
  "Git & GitHub": "GitHub",
  "Career Guidance": "Guidance",
  "Contact MastCode": "Contact",
  "Courses & Training": "Courses",
  "Jobs & Internships": "Jobs",
  "College Partnerships": "Colleges",
  "Business Services": "Business",
  "Website Development": "Websites",
  "Digital Marketing": "Marketing",
};

const COURSE_DETAILS: Record<string, {
  title: string;
  duration: string;
  level: string;
  overview: string;
  skills: string[];
  outcome: string;
}> = {
  "full stack development": {
    title: "Full Stack Development",
    duration: "90 days",
    level: "Beginner to intermediate",
    overview:
      "Learn frontend, backend, databases, authentication, APIs, deployment, and project workflow through practical full-stack projects.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "PostgreSQL", "Git", "Docker"],
    outcome:
      "You finish with a deployable full-stack project, a stronger portfolio, and interview-ready project explanations.",
  },
  "web development": {
    title: "Web Development",
    duration: "90 days",
    level: "Beginner friendly",
    overview:
      "Build responsive websites and modern web applications from fundamentals to React-based interfaces.",
    skills: ["HTML", "CSS", "JavaScript", "Responsive Design", "React", "APIs", "Deployment"],
    outcome:
      "You can create clean, mobile-friendly websites and interactive frontend projects.",
  },
  "python programming": {
    title: "Python Programming",
    duration: "Flexible batch duration",
    level: "Beginner friendly",
    overview:
      "Start with Python fundamentals and progress into problem solving, automation, data handling, and practical scripts.",
    skills: ["Python basics", "Functions", "OOP", "File handling", "Automation", "APIs", "Mini projects"],
    outcome:
      "You gain confidence writing Python programs and building useful beginner-to-intermediate projects.",
  },
  "sql & database management": {
    title: "SQL & Database Management",
    duration: "90 days",
    level: "Beginner to intermediate",
    overview:
      "Learn relational database concepts, SQL queries, schema design, joins, aggregation, and query optimization basics.",
    skills: ["SQL", "MySQL", "PostgreSQL", "DBMS", "Joins", "Indexes", "Database design"],
    outcome:
      "You can design databases and write practical queries for applications, analytics, and backend work.",
  },
  "artificial intelligence": {
    title: "Artificial Intelligence",
    duration: "90 days",
    level: "Foundation to applied",
    overview:
      "Build AI fundamentals with Python, machine learning concepts, generative AI basics, LLM workflows, and applied projects.",
    skills: ["Python", "Machine Learning", "GenAI", "LLMs", "RAG", "AI Agents", "Prompting"],
    outcome:
      "You understand core AI workflows and can build practical AI-assisted applications and demos.",
  },
  "machine learning": {
    title: "Machine Learning",
    duration: "90 days",
    level: "Intermediate",
    overview:
      "Learn the machine learning workflow from data preparation to model training, evaluation, and applied use cases.",
    skills: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
    outcome:
      "You can prepare data, train models, evaluate results, and explain ML projects clearly.",
  },
  "data analytics": {
    title: "Data Analytics",
    duration: "90 days",
    level: "Beginner to intermediate",
    overview:
      "Learn how to clean, analyze, visualize, and present data for practical business and career use cases.",
    skills: ["Excel", "SQL", "Python", "Pandas", "NumPy", "Power BI", "Statistics"],
    outcome:
      "You can turn raw data into clear insights, dashboards, and portfolio-ready analysis projects.",
  },
  "cloud computing": {
    title: "Cloud Computing",
    duration: "90 days",
    level: "Foundation to intermediate",
    overview:
      "Understand cloud fundamentals, Linux, deployment, containers, DevOps basics, and modern infrastructure workflows.",
    skills: ["AWS", "Azure", "Linux", "Docker", "Kubernetes", "Terraform", "DevOps"],
    outcome:
      "You can understand cloud architecture and deploy projects with modern cloud tooling.",
  },
  "git & github": {
    title: "Git & GitHub",
    duration: "Short practical module",
    level: "Beginner friendly",
    overview:
      "Learn version control, Git commands, GitHub repositories, branches, pull requests, and collaboration workflow.",
    skills: ["Git", "GitHub", "Commits", "Branches", "Pull requests", "Collaboration"],
    outcome:
      "You can manage code professionally and collaborate using GitHub.",
  },
};

type ChatSender = "assistant" | "user";

type ChatMessage = {
  id: string;
  sender: ChatSender;
  text: string;
  time: string;
  quickReplies?: string[];
  ctas?: Array<{ label: string; href?: string; action?: string; type?: "link" | "button" }>;
};

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  interestedService: string;
  message: string;
};

function formatTime(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function normalizeTopic(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function createReply(input: string, context: { lastTopic: string | null }): {
  text: string;
  quickReplies?: string[];
  ctas?: ChatMessage["ctas"];
  leadForm?: boolean;
  leadTopic?: string;
} {
  const value = input.trim();
  const lower = value.toLowerCase();
  const normalized = normalizeTopic(value);
  const selectedCourse = COURSE_DETAILS[normalized];

  if (selectedCourse) {
    context.lastTopic = "training";
    return {
      text:
        `${selectedCourse.title}\n\nDuration: ${selectedCourse.duration}\nLevel: ${selectedCourse.level}\n\n${selectedCourse.overview}\n\nSkills covered: ${selectedCourse.skills.join(", ")}.\n\nOutcome: ${selectedCourse.outcome}\n\nWould you like to view another course or contact MastCode for admission guidance?`,
      quickReplies: [...COURSE_SUGGESTIONS, "Career Guidance", "Contact MastCode"],
      ctas: [
        { label: "Contact MastCode", href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${selectedCourse.title} Course Enquiry`)}` },
      ],
    };
  }

  if (!value) {
    return {
      text: "Please share a question or topic you’d like help with.",
      quickReplies: [...DEFAULT_SUGGESTIONS],
    };
  }

  if (/hello|hi|hey|good morning|good evening/i.test(lower)) {
    return {
      text:
        "👋 Hello! I'm MastCode Assistant, your virtual guide.\n\nI'm here to help you explore MastCode's programs, career opportunities, training services, internships, college partnerships, and business solutions.\n\nWhat would you like to know?",
      quickReplies: [...DEFAULT_SUGGESTIONS],
    };
  }

  if (/(course|courses|training|python|frontend|backend|ai|machine learning|ml|full stack|full-stack|web development|program)/i.test(lower)) {
    context.lastTopic = "training";
    return {
      text:
        "MastCode offers practical, career-focused technology training. Select a course below and I will show the duration, level, skills covered, and learning outcome.",
      quickReplies: [...COURSE_SUGGESTIONS, "Career Guidance", "Contact MastCode"],
      ctas: [
        { label: "Full Stack Development", action: "Full Stack Development" },
        { label: "Python Programming", action: "Python Programming" },
        { label: "Talk to MastCode", href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("MastCode Assistant Enquiry")}` },
      ],
    };
  }

  if (/(career|job|jobs|placement|resume|interview|opportunity|career guidance|get a job)/i.test(lower)) {
    context.lastTopic = "career";
    return {
      text:
        "MastCode supports students and professionals through career counselling, resume guidance, interview preparation, and placement readiness support.\n\nWe help you understand the right path, prepare for opportunities, and build confidence for your next move.\n\nPlease check the Careers section of the website or contact our team for the latest opportunities. We do not promise guaranteed jobs unless they are officially confirmed.",
      quickReplies: ["Jobs & Internships", "Career Guidance", "Contact MastCode"],
      ctas: [
        { label: "Explore Careers", action: "Jobs & Internships" },
        { label: "Contact MastCode", href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Career Guidance Enquiry")}` },
      ],
    };
  }

  if (/(internship|internships|paid internship|intern)/i.test(lower)) {
    context.lastTopic = "internships";
    return {
      text:
        "MastCode provides internship opportunities designed to help learners build relevant experience and practical confidence.\n\nIf you're looking for internship information, the latest details are usually shared through the Careers or Internships section of the website.\n\nIf you want, I can help you understand which internship track may be a good fit for your background.",
      quickReplies: ["Jobs & Internships", "Career Guidance", "Talk to MastCode"],
      ctas: [
        { label: "Explore Internships", action: "Jobs & Internships" },
        { label: "Talk to MastCode", href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Internship Enquiry")}` },
      ],
    };
  }

  if (/(college|institution|school|principal|hod|partner|partnership|workshop|webinar|training program)/i.test(lower)) {
    context.lastTopic = "institution";
    return {
      text:
        "MastCode collaborates with schools and colleges to support technical training, career guidance sessions, workshops, webinars, placement preparation, and student development programs.\n\nWould you like to connect with MastCode regarding an institutional partnership?",
      quickReplies: ["Partner With MastCode", "Request a Workshop", "Contact Our Team"],
      ctas: [
        { label: "Partner With MastCode", action: "Partner With MastCode" },
        { label: "Contact Our Team", href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Institution Partnership Enquiry")}` },
      ],
      leadForm: true,
      leadTopic: "Institution Partnership",
    };
  }

  if (/(website|site|business|digital marketing|seo|social media|branding|content|grow|business solutions)/i.test(lower)) {
    context.lastTopic = "business";
    return {
      text:
        "MastCode helps businesses with website development, website enhancement, digital marketing, social media marketing, SEO, branding support, content support, and digital growth solutions.\n\nWe can support businesses that want a stronger online presence and more effective digital engagement.\n\nWould you like to discuss your business requirements with MastCode?",
      quickReplies: ["Website Development", "Digital Marketing", "Discuss My Project"],
      ctas: [
        { label: "Website Development", action: "Website Development" },
        { label: "Discuss My Project", href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Business Requirements Enquiry")}` },
      ],
      leadForm: true,
      leadTopic: "Business Solutions",
    };
  }

  if (/(contact|email|call|reach|connect|how to connect|talk to mastcode|where to contact)/i.test(lower)) {
    return {
      text:
        "You can contact MastCode directly at: rakshithamastcode@gmail.com\n\nIf you’d like, I can also help you connect with the right team based on your request.",
      quickReplies: ["Career Guidance", "College Partnerships", "Business Services"],
      ctas: [
        { label: "Contact MastCode", href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("MastCode Support")}` },
      ],
    };
  }

  if (/(beginner|best course|which course|recommend|suitable)/i.test(lower)) {
    return {
      text:
        "For beginners, the best starting point depends on your interest.\n\n- If you want to build websites: start with frontend development or full-stack web development\n- If you want to work with data and automation: consider Python\n- If you want to explore AI: begin with Python and AI fundamentals\n\nMastCode can help you choose a path based on your background and career goal.",
      quickReplies: ["Courses & Training", "Career Guidance", "Contact MastCode"],
      ctas: [
        { label: "Explore Courses", action: "Courses & Training" },
        { label: "Talk to MastCode", href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Course Recommendation")}` },
      ],
    };
  }

  if (/(how long|duration|length|time)/i.test(lower)) {
    const trackPhrase = context.lastTopic === "training" ? "For the training programme" : "Depending on the program";
    return {
      text:
        `${trackPhrase}, the duration may vary based on the course or training track selected. MastCode's learning paths are designed to balance skill-building with practical application and career readiness.\n\nIf you tell me which program you're interested in, I can guide you more specifically.`,
      quickReplies: ["Courses & Training", "Career Guidance", "Talk to MastCode"],
    };
  }

  if (/(website development|website enhancement|seo|digital marketing|social media marketing|branding)/i.test(lower)) {
    return {
      text:
        "MastCode supports business growth with professional website development, website enhancement, SEO, digital marketing, social media marketing, branding support, and content strategy.\n\nIf you want a custom solution, the best next step is to share your project goals and requirements with our team.",
      quickReplies: ["Website Development", "Digital Marketing", "Discuss My Project"],
      leadForm: true,
      leadTopic: "Business Solutions",
    };
  }

  if (/i am a college principal|i am a college|principal|hod|college teacher|college management/i.test(lower)) {
    return {
      text:
        "MastCode works with educational institutions to deliver technical training, career guidance, workshops, placement preparation, and student development programs.\n\nWould you like to connect with MastCode regarding an institutional partnership?",
      quickReplies: ["Partner With MastCode", "Request a Workshop", "Contact Our Team"],
      leadForm: true,
      leadTopic: "Institution Partnership",
    };
  }

  if (/(student|professional|business)/i.test(lower)) {
    return {
      text:
        "MastCode supports students, professionals, educational institutions, and businesses through skills training, career support, technical learning, and digital growth solutions.\n\nIf you tell me which group you belong to, I can guide you to the most relevant next step.",
      quickReplies: ["Courses & Training", "Career Guidance", "Business Services"],
    };
  }

  return {
    text:
      "I don't have confirmed information about that yet. You can contact the MastCode team directly, and they'll be happy to help you.\n\nPlease check the website sections for the latest details or send a message for a direct response.",
    quickReplies: ["Contact MastCode", "Career Guidance", "Business Services"],
    ctas: [{ label: "Contact MastCode", href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("MastCode Support")}` }],
  };
}

export function MastCodeAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text:
        "👋 Hello! I'm MastCode Assistant, your virtual guide.\n\nI'm here to help you explore MastCode's programs, career opportunities, training services, internships, college partnerships, and business solutions.\n\nWhat would you like to know?",
      time: formatTime(),
      quickReplies: [...DEFAULT_SUGGESTIONS],
    },
  ]);
  const [context, setContext] = useState<{ lastTopic: string | null }>({ lastTopic: null });
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadTopic, setLeadTopic] = useState("General Enquiry");
  const [leadForm, setLeadForm] = useState<LeadFormState>({
    name: "",
    email: "",
    phone: "",
    interestedService: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [draft, setDraft] = useState("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showLeadForm, isOpen]);

  const quickActionList = useMemo(() => {
    const latestAssistantMessage = [...messages].reverse().find((message) => message.sender === "assistant");
    return latestAssistantMessage?.quickReplies?.length
      ? latestAssistantMessage.quickReplies
      : [...DEFAULT_SUGGESTIONS];
  }, [messages]);

  const addMessage = (sender: ChatSender, text: string, quickReplies?: string[], ctas?: ChatMessage["ctas"]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        sender,
        text,
        time: formatTime(),
        quickReplies,
        ctas,
      },
    ]);
  };

  const handleAssistantReply = (input: string) => {
    const nextContext = { ...context };
    const reply = createReply(input, nextContext);

    if (reply.leadForm) {
      setLeadTopic(reply.leadTopic ?? "General Enquiry");
      setShowLeadForm(true);
    } else {
      setShowLeadForm(false);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        sender: "assistant",
        text: reply.text,
        time: formatTime(),
        quickReplies: reply.quickReplies ?? [...DEFAULT_SUGGESTIONS],
        ctas: reply.ctas,
      },
    ]);

    setContext(nextContext);
    setIsTyping(false);
  };

  const handleSend = (value?: string) => {
    const messageToSend = (value ?? draft).trim();
    if (!messageToSend) return;

    addMessage("user", messageToSend);
    setDraft("");
    setIsTyping(true);

    setTimeout(() => {
      handleAssistantReply(messageToSend);
    }, 550);
  };

  const handleQuickAction = (action: string) => {
    if (action === "Contact MastCode") {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("MastCode Assistant Enquiry")}`;
      return;
    }
    addMessage("user", action);
    setIsTyping(true);
    setTimeout(() => {
      const nextContext = { ...context };
      const reply = createReply(action, nextContext);
      setShowLeadForm(Boolean(reply.leadForm));
      if (reply.leadForm) {
        setLeadTopic(reply.leadTopic ?? "General Enquiry");
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          sender: "assistant",
          text: reply.text,
          time: formatTime(),
          quickReplies: reply.quickReplies ?? [...DEFAULT_SUGGESTIONS],
          ctas: reply.ctas,
        },
      ]);
      setContext(nextContext);
      setIsTyping(false);
    }, 450);
  };

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!leadForm.name.trim() || !leadForm.email.trim()) {
      return;
    }

    try {
      await submitJsonForm({
        form_type: "chatbot_lead",
        full_name: leadForm.name.trim(),
        email: leadForm.email.trim(),
        phone: leadForm.phone.trim(),
        interestedService: leadForm.interestedService || leadTopic,
        conversation_topic: leadTopic,
        message: leadForm.message.trim(),
      });
    } catch (error) {
      addMessage(
        "assistant",
        error instanceof Error ? error.message : "Unable to save your enquiry. Please try again.",
        ["Contact MastCode", "Courses & Training", "Business Services"],
      );
      return;
    }

    setSubmitted(true);
    setShowLeadForm(false);
    addMessage(
      "assistant",
      "Thank you! Your enquiry has been received. The MastCode team will get back to you soon.",
      ["Contact MastCode", "Courses & Training", "Business Services"],
      [{ label: "Contact MastCode", href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("MastCode Enquiry")}` }],
    );
    setLeadForm({ name: "", email: "", phone: "", interestedService: leadTopic, message: "" });
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "assistant",
        text:
          "👋 Hello! I'm MastCode Assistant, your virtual guide.\n\nI'm here to help you explore MastCode's programs, career opportunities, training services, internships, college partnerships, and business solutions.\n\nWhat would you like to know?",
        time: formatTime(),
        quickReplies: [...DEFAULT_SUGGESTIONS],
      },
    ]);
    setContext({ lastTopic: null });
    setShowLeadForm(false);
    setSubmitted(false);
    setLeadForm({ name: "", email: "", phone: "", interestedService: "", message: "" });
    setDraft("");
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open MastCode Assistant"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-foreground shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg ${isOpen ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}
      >
        <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary p-1.5">
          <img src={MASTCODE_LOGO_URL} alt="MastCode logo" className="h-full w-full object-contain" />
        </span>
        <span className="text-left">
          <span className="block text-sm font-bold tracking-wide">MastCode Assistant</span>
          <span className="block text-xs text-muted-foreground">Courses, careers, services</span>
        </span>
      </button>

      <div
        className={`fixed bottom-5 right-5 z-40 transition-all duration-500 ease-out ${isOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0"}`}
        style={{ maxWidth: "calc(100vw - 24px)" }}
      >
        <div
          role="dialog"
          aria-modal="false"
          aria-label="MastCode Assistant"
          className={`overflow-hidden rounded-2xl border border-border bg-white text-foreground shadow-lg ${isMinimized ? "hidden" : "block"}`}
          style={{ width: "min(410px, calc(100vw - 20px))", height: "min(620px, calc(100vh - 100px))" }}
        >
          <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary p-1.5">
                <img src={MASTCODE_LOGO_URL} alt="MastCode logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">MastCode Assistant</p>
                  <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">MastCode</span>
                </div>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online - Ready to Help
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Restart conversation"
                onClick={clearChat}
                className="rounded-lg border border-border bg-white p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Minimize chat"
                onClick={() => setIsMinimized(true)}
                className="rounded-lg border border-border bg-white p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-border bg-white p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(100%-111px)] flex-col bg-secondary">
            <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-white text-foreground shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.text}</div>

                    {message.ctas && message.ctas.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.ctas.map((cta) =>
                          cta.href ? (
                            <a
                              key={cta.label}
                              href={cta.href}
                            className="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/40 hover:bg-white"
                            >
                              {cta.label}
                            </a>
                          ) : (
                            <button
                              key={cta.label}
                              type="button"
                              onClick={() => cta.action && handleQuickAction(cta.action)}
                              className="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/40 hover:bg-white"
                            >
                              {cta.label}
                            </button>
                          ),
                        )}
                      </div>
                    )}

                    <div className="mt-2 text-[10px] opacity-70">{message.time}</div>
                  </div>
                </div>
              ))}

              {showLeadForm && !submitted && (
                <div className="rounded-2xl border border-border bg-white p-3 text-foreground shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                    <Sparkles className="h-4 w-4" /> Enquiry for {leadTopic}
                  </div>
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        value={leadForm.name}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, name: e.target.value }))}
                        aria-label="Name"
                        placeholder="Name"
                        className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
                      />
                      <input
                        value={leadForm.email}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, email: e.target.value }))}
                        aria-label="Email"
                        type="email"
                        placeholder="Email"
                        className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, phone: e.target.value }))}
                        aria-label="Phone Number"
                        placeholder="Phone Number (optional)"
                        className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
                      />
                      <select
                        value={leadForm.interestedService || leadTopic}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, interestedService: e.target.value }))}
                        aria-label="Interested Service"
                        className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                      >
                        <option value="">Interested Service</option>
                        <option value="Career Guidance">Career Guidance</option>
                        <option value="Courses & Training">Courses & Training</option>
                        <option value="Institution Partnership">Institution Partnership</option>
                        <option value="Business Solutions">Business Solutions</option>
                        <option value="Website Development">Website Development</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                      </select>
                    </div>
                    <textarea
                      value={leadForm.message}
                      onChange={(e) => setLeadForm((prev) => ({ ...prev, message: e.target.value }))}
                      aria-label="Message"
                      placeholder="Tell us how MastCode can help"
                      rows={3}
                      className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
                    />
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-700">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Please avoid sharing sensitive personal information.
                    </div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-accent"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Send Enquiry
                    </button>
                  </form>
                </div>
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-border bg-white px-3 py-2.5 text-muted-foreground shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.05s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>

            {!showLeadForm && (
              <div className="relative border-t border-border bg-white px-3 py-2">
                <div className="hide-scrollbar flex gap-1.5 overflow-x-auto pb-0.5 pr-5">
                  {quickActionList.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleQuickAction(action)}
                      title={action}
                      className="shrink-0 rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold leading-5 text-primary transition hover:border-primary/40 hover:bg-white"
                    >
                      {COMPACT_SUGGESTION_LABELS[action] ?? action}
                    </button>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" aria-hidden="true" />
              </div>
            )}

            <div className="border-t border-border bg-white px-3 py-3">
              <div className="flex items-end gap-2 rounded-xl border border-input bg-secondary p-2 focus-within:border-primary">
                <textarea
                  rows={1}
                  value={draft}
                  aria-label="Ask anything about MastCode"
                  placeholder="Ask anything about MastCode..."
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  className="max-h-28 min-h-[42px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Send message"
                  disabled={!draft.trim() || isTyping}
                  onClick={() => handleSend()}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <SendHorizonal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isMinimized && (
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="mt-3 flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
          >
            <MessageSquareText className="h-4 w-4" />
            MastCode Assistant
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>
    </>
  );
}

