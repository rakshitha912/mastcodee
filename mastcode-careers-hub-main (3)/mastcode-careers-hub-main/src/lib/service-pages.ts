export type ServiceType =
  | "career_counselling"
  | "placement_assistance"
  | "institution_partnership"
  | "website_development"
  | "digital_marketing";

export type ServiceField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "date" | "textarea" | "select" | "file";
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export type ServicePage = {
  type: ServiceType;
  eyebrow: string;
  title: string;
  price?: string;
  paragraphs: string[];
  fields: ServiceField[];
  submitLabel: string;
  successMessage: string;
};

export const servicePages: Record<ServiceType, ServicePage> = {
  career_counselling: {
    type: "career_counselling",
    eyebrow: "Career Counselling & Guidance",
    title: "Find the Right Direction for Your Career",
    price: "Program Fee: Rs 5,000",
    paragraphs: [
      "Choosing the right career path can sometimes feel confusing, especially with so many courses, skills, and opportunities available today. MastCode's Career Counselling & Guidance program helps students and professionals gain clarity about their interests, strengths, skills, and future career possibilities. Our goal is to help individuals make informed decisions and move forward with confidence.",
      "Through personalised guidance and structured counselling, we help individuals understand suitable career paths and the skills required to achieve their goals. Whether someone is unsure about what to study, which career to choose, or how to move forward professionally, MastCode provides guidance to create a clearer direction for the future.",
      "We also support overall career development through skill recommendations, career planning, resume guidance, portfolio improvement, and interview preparation. The aim is to provide a practical roadmap that helps individuals move from confusion to clarity and confidently work towards their professional goals.",
    ],
    fields: [
      { name: "full_name", label: "Full Name", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "qualification", label: "Current Education / Qualification", required: true },
      { name: "institution", label: "College / Institution Name" },
      { name: "career_stage", label: "Current Career Stage", type: "select", options: ["Student", "Graduate", "Working Professional", "Career Switcher"] },
      { name: "interest", label: "Area of Interest / Preferred Career" },
      { name: "confusion", label: "What are you currently confused about?", type: "textarea" },
      { name: "goals", label: "Career Goals", type: "textarea" },
      { name: "mode", label: "Preferred Mode of Counselling", type: "select", options: ["Online", "Offline"] },
      { name: "preferred_time", label: "Preferred Date/Time", type: "date" },
      { name: "message", label: "Additional Message", type: "textarea" },
    ],
    submitLabel: "Submit Career Counselling Request",
    successMessage: "Your Career Counselling Request Has Been Submitted Successfully! Our team will contact you shortly.",
  },
  placement_assistance: {
    type: "placement_assistance",
    eyebrow: "Placement Assistance",
    title: "Connecting You With Career Opportunities",
    price: "Placement Assistance: FREE - No Charges",
    paragraphs: [
      "MastCode provides Placement Assistance to support students and professionals in preparing for career opportunities. We understand that having skills alone is not always enough, and candidates also need proper guidance to present themselves confidently during the recruitment process.",
      "Our placement assistance includes support with resume improvement, interview preparation, professional profile development, and guidance on preparing for available opportunities. We help candidates understand how to present their skills, knowledge, and projects in a more professional and effective way.",
      "MastCode aims to support suitable candidates by sharing relevant opportunities and helping them become better prepared for their career journey. There are absolutely no charges for Placement Assistance. Selection and employment depend on the candidate's performance, skills, and employer requirements.",
    ],
    fields: [
      { name: "full_name", label: "Full Name", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "location", label: "Current Location", required: true },
      { name: "qualification", label: "Highest Qualification", required: true },
      { name: "institution", label: "College / Institution Name" },
      { name: "graduation_year", label: "Graduation Year", type: "text", required: true },
      { name: "skills", label: "Skills", type: "textarea", required: true },
      { name: "experience", label: "Years of Experience" },
      { name: "job_role", label: "Preferred Job Role", required: true },
      { name: "work_location", label: "Preferred Work Location" },
      { name: "resume", label: "Resume Upload", type: "file", required: true },
      { name: "linkedin", label: "LinkedIn Profile URL", type: "url" },
      { name: "portfolio", label: "Portfolio / GitHub URL", type: "url" },
      { name: "message", label: "Additional Information", type: "textarea" },
    ],
    submitLabel: "Register for Placement Assistance",
    successMessage: "Registration Successful! Your profile has been submitted for Placement Assistance. Our team will contact you when suitable opportunities are available.",
  },
  institution_partnership: {
    type: "institution_partnership",
    eyebrow: "Educational Institution Partnerships",
    title: "Empowering Institutions. Preparing Future Talent.",
    paragraphs: [
      "MastCode partners with educational institutions to create stronger learning and career development opportunities for students. We provide industry-focused training programs, workshops, technical sessions, career guidance, and skill-development initiatives designed to complement academic education.",
      "Through collaborations, MastCode provides programs in areas such as Web Development, Python, AI & Machine Learning, Frontend Development, Backend Development, career counselling, placement preparation, resume guidance, and interview preparation.",
      "Our partnerships help institutions develop more confident and industry-ready students. By connecting education with practical skills and career opportunities, we aim to improve student employability and provide valuable industry exposure.",
    ],
    fields: [
      { name: "institution", label: "Institution Name", required: true },
      { name: "contact_person", label: "Contact Person", required: true },
      { name: "designation", label: "Designation", required: true },
      { name: "email", label: "Official Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "location", label: "Institution Location", required: true },
      { name: "institution_type", label: "Type of Institution", type: "select", options: ["School", "College", "University", "Training Institute", "Other"] },
      { name: "students", label: "Number of Students" },
      { name: "interest", label: "Areas of Interest", type: "textarea" },
      { name: "collaboration", label: "Preferred Collaboration", type: "textarea" },
      { name: "message", label: "Message / Requirements", type: "textarea" },
    ],
    submitLabel: "Submit Partnership Enquiry",
    successMessage: "Your Institution Partnership Enquiry has been submitted successfully. Our team will contact you shortly.",
  },
  website_development: {
    type: "website_development",
    eyebrow: "Website Development & Enhancement",
    title: "Build, Improve & Strengthen Your Digital Presence",
    price: "Starting From: Rs 7,000",
    paragraphs: [
      "Your website is one of the most important parts of your business's digital presence. MastCode helps businesses build, improve, and enhance websites that are professional, modern, responsive, and designed to support their business goals.",
      "Whether you already have a website that needs improvement or want to enhance its design and functionality, our team provides solutions based on your requirements. We focus on website design, responsiveness, user experience, functionality, content structure, and overall performance.",
      "Our goal is to help businesses create a professional and effective online presence that supports growth. MastCode provides practical solutions that make websites more attractive, useful, and user-friendly.",
    ],
    fields: [
      { name: "full_name", label: "Full Name", required: true },
      { name: "company", label: "Business / Company Name", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "website", label: "Existing Website URL (if available)", type: "url" },
      { name: "website_type", label: "Type of Website Required", type: "select", options: ["Business Website", "Portfolio Website", "E-commerce Website", "Educational Website", "Other"] },
      { name: "project_type", label: "Do you need a new website or enhancement?", type: "select", options: ["New Website", "Website Enhancement"] },
      { name: "features", label: "Required Features", type: "textarea" },
      { name: "budget", label: "Estimated Budget" },
      { name: "message", label: "Project Description / Requirements", type: "textarea", required: true },
    ],
    submitLabel: "Request Website Consultation",
    successMessage: "Your Website Consultation Request has been submitted successfully. Our team will contact you shortly.",
  },
  digital_marketing: {
    type: "digital_marketing",
    eyebrow: "Digital Marketing",
    title: "Grow Your Brand. Reach the Right Audience.",
    price: "Starting From: Rs 7,000",
    paragraphs: [
      "In today's digital world, having a great product or service is not enough-you also need the right strategy to reach your audience. MastCode helps businesses strengthen their online presence through digital marketing strategies designed around their business goals and target audience.",
      "Our digital marketing services can include social media marketing, SEO, content strategy, branding, and digital campaign support. We focus on helping businesses improve visibility, communicate effectively with their audience, and create a stronger professional digital presence.",
      "With the right combination of technology, creativity, and strategy, businesses can explore new opportunities for growth. MastCode aims to become a digital growth partner by providing practical marketing solutions that strengthen brands and improve connections with potential customers.",
    ],
    fields: [
      { name: "full_name", label: "Full Name", required: true },
      { name: "company", label: "Business / Company Name", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "industry", label: "Business Industry", required: true },
      { name: "website", label: "Website URL (if available)", type: "url" },
      { name: "social_links", label: "Social Media Links", type: "textarea" },
      { name: "services", label: "Services Required", type: "select", options: ["Social Media Marketing", "SEO", "Content Marketing", "Branding", "Paid Advertising", "Other"] },
      { name: "goals", label: "Business Goals", type: "textarea" },
      { name: "audience", label: "Target Audience", type: "textarea" },
      { name: "budget", label: "Estimated Monthly Budget" },
      { name: "message", label: "Additional Requirements", type: "textarea" },
    ],
    submitLabel: "Request Digital Marketing Consultation",
    successMessage: "Your Digital Marketing Consultation Request has been submitted successfully. Our team will contact you shortly.",
  },
};

