# MastCode Careers Hub

# Build a Professional MastCode Careers & Company Profile Website




Create a modern, premium, responsive **Careers & Company Profile website for MastCode**, an education and technology platform focused on helping students and professionals learn practical technology skills and build careers.




The website should look like a real startup/technology company website suitable for sharing on **LinkedIn, job postings, recruitment, students, trainers, and potential partners**.




---




## 0. Tech Stack (NEW — was undefined)




The original spec said "structure so backend services can be connected using Supabase/Firebase" but never committed to a stack, which leaves a builder guessing. Recommend locking this down upfront:




- **Frontend:** React (Next.js recommended for SEO — server-side rendering matters for the Open Graph/SEO goals in Section 17) + Tailwind CSS

- **Backend/DB:** Supabase (Postgres + Auth + Storage) — handles resume file storage, admin auth, and applicant data in one place without a separate backend

- **Hosting:** Vercel or Netlify (both integrate cleanly with Next.js and Supabase)

- **Forms/Email:** Resend or SendGrid for transactional email (see Section 6a below)

- **Image hosting:** Next.js Image component + Supabase Storage or Cloudinary for optimization




State explicitly if a different stack (e.g., plain HTML/CSS/JS + PHP, or WordPress) is preferred — the component/animation requirements later in the spec (glassmorphism, scroll animations, carousel) assume a component-based frontend.




---




## Brand




Company Name: **MastCode**




Tagline: **CODE · BUILD · GROW**




Position MastCode as a technology education and career-development platform offering practical courses, projects, mentorship, and career opportunities.




### Brand Identity (NEW — was missing)




Design specs like "premium" and "modern SaaS" are subjective without anchors. Define before building:




- **Primary color:** (pick one, e.g., deep indigo `#4F46E5` or teal `#0D9488` — tech-education brands lean blue/purple/teal to signal trust + innovation)

- **Accent/CTA color:** a warm contrasting color for buttons (e.g., amber or coral) so CTAs stand out against the primary palette

- **Typography:** a modern sans-serif pairing — e.g., **Inter** or **Sora** for headings, **Inter** or **Manrope** for body text

- **Logo:** if no logo exists yet, specify a simple wordmark/icon placeholder (e.g., "<>" bracket motif or geometric "M") rather than leaving it undefined

- **Illustration style:** flat/isometric tech illustrations vs. photography of real people — pick one and stay consistent (mixing both looks templated)




---




# 1. Header / Navigation




Create a sticky professional navbar.




Left: MastCode logo, MastCode




Navigation: Home · About · Courses · Careers · Contact




Right: Login · Join MastCode




Use a clean modern technology-company design.




**Mobile:** collapses into a hamburger menu (see Section 16).




---




# 2. Hero Section




Headline: **Build Your Skills. Build Your Career.**




Subheading: **MastCode helps students and aspiring technology professionals learn practical skills, work on real-world projects, and prepare for successful careers in technology.**




Primary button: **Explore Careers**

Secondary button: **Explore Courses**




Add a modern technology-themed visual on the right (developers, students learning, AI/ML, coding, cloud, software dev). Add subtle animations and floating technology elements.




*Note: if using stock/AI-generated imagery, ensure it doesn't depict real, identifiable people without rights, and avoid anything resembling another brand's product UI.*




---




# 3. About MastCode




Section title: **About MastCode**




Content: **MastCode is a technology education and career platform designed to bridge the gap between academic learning and industry requirements. We focus on practical learning, real-world projects, mentorship, and career preparation.**




4 feature cards: Practical Learning · Industry Skills · Real Projects · Career Growth (descriptions unchanged from original).




---




# 4. Why Join MastCode?




Title: **Why Build Your Career With MastCode?**




Cards (8 items, unchanged from original — real-world projects, modern tools, team collaboration, industry experience, technical/communication skills, portfolio building, mentorship, startup growth). Use icons and subtle hover animations.




---




# 5. Careers Section




Heading: **Build the Future With MastCode**




Description: **We are looking for passionate learners, developers, designers, trainers, marketers, and technology enthusiasts who want to learn, build, and grow with us.**




### Job Filtering & Search (ENHANCED — original only said "job search" and "filters" in Section 19 without defining criteria)




Specify filter dimensions explicitly so it's buildable:

- Filter by: **Department** (Engineering, AI/ML, Marketing, Training), **Type** (Internship/Full-time/Part-time), **Location** (Bangalore/Remote/Hybrid), **Experience level**

- Search bar: free-text search across job title and skills

- Sort by: Newest first / Most relevant




### Job Cards




Five roles as originally specified: AI/ML Intern, Full Stack Developer Intern, Web Developer, Technical Trainer, Digital Marketing Intern — each with Location, Type, Experience, Description, Skills tags, and an **Apply Now** button.




*(Full role details preserved from original spec — no changes needed to the content itself, only presentation/filtering above.)*




---




# 6. Job Application Form




Fields: Full Name, Email, Mobile Number, Current Location, Position Applying For, Highest Qualification, Skills, Experience, LinkedIn Profile, GitHub Profile, Portfolio Website, Resume Upload, Cover Letter.




Button: **Submit Application**




Success message: **Application Submitted Successfully!** / **Thank you for your interest in MastCode. Our team will review your application and contact you if your profile matches our requirements.**




### 6a. Form Validation & File Upload Rules (NEW — was unspecified, a real gap for "production-ready")




- **Required fields:** Full Name, Email, Mobile Number, Position, Resume — mark others optional

- **Email/phone validation:** standard format checks, inline error messages (not just on submit)

- **Resume upload constraints:** accept PDF/DOC/DOCX only, max 5MB, reject other file types client-side and server-side

- **Spam/bot protection:** add a CAPTCHA (hCaptcha/reCAPTCHA) or honeypot field on both the application form and the contact form

- **Confirmation email:** auto-send the applicant a confirmation email on submission; notify the admin inbox of new applications

- **Duplicate prevention:** flag if the same email applies to the same role twice within a short window




---




# 7. Employee / Candidate Profile Section




**Meet the People Behind MastCode** — profile cards with photo, name, role, bio, LinkedIn/GitHub icons.




Example: **Rakshitha S.**, Founder & Technology Lead — *Building practical technology education and career opportunities through MastCode.*




Make this section editable via the admin dashboard so team members can be added later.




---




# 8. Courses Section




**Learn In-Demand Technology Skills**




Course list: Python Programming, SQL & Database Management, Full Stack Development, Artificial Intelligence, Machine Learning, Data Analytics, Web Development, Cloud Computing, Git & GitHub.




Each card: icon, title, short description, skill level, duration, **View Course** button.




*Clarify: does "View Course" link to an external course page/LMS, a modal with a syllabus, or is it a placeholder for now? This affects whether a course detail page needs to be built.*




---




# 9. Career Statistics




**500+** Learners · **25+** Practical Projects · **10+** Technology Courses · **50+** Career Opportunities — editable from admin dashboard.




### Content accuracy note (NEW)




Since this reads as a real company site, these numbers should reflect actual current figures rather than placeholder marketing copy, especially since the site may be shared publicly on LinkedIn/job boards. Recommend either using real current numbers (even if smaller, e.g., "Newly launched — building our first cohort") or clearly marking them as editable placeholders to update before public launch.




---




# 10. Testimonials




**What Our Learners Say** — photo, name, course, testimonial, rating, smooth carousel.




*If there are no real testimonials yet at launch, consider omitting this section rather than using fabricated quotes/ratings, and adding it once genuine testimonials exist.*




---




# 11. Call To Action




**Your Career Starts With One Step.**




Text: **Learn new skills, build real projects, and prepare yourself for the future of technology.**




Buttons: **Start Learning** · **Join Our Team**




---




# 12. Contact Section




**Let's Connect** — Email, Phone, Bangalore/Karnataka/India address, LinkedIn, Instagram, YouTube, GitHub. Contact form: Name, Email, Subject, Message, **Send Message** button (with same CAPTCHA/spam protection as Section 6a).




---




# 13. Footer




MastCode / CODE · BUILD · GROW / Company, Learning, Resources link groups / Social icons / **© 2026 MastCode. All Rights Reserved.**




### Legal links (NEW — required if collecting applicant/contact data)




Add **Privacy Policy** and **Terms of Use** links to the footer. Since the site collects personal data (resumes, contact info, applications), a privacy policy is not optional — India's Digital Personal Data Protection (DPDP) Act 2023 applies to any site processing personal data of individuals in India. At minimum the policy should cover: what data is collected, how resumes/applications are stored and for how long, who has access (admin dashboard), and how a user can request deletion of their data.




---




# 14. Admin Dashboard




**Job Management:** add/edit/delete/close job, view applicants

**Applicant Management:** view applications, download resumes, change status, shortlist, reject, contact candidate

**Application statuses:** Applied → Under Review → Shortlisted → Interview → Selected / Rejected

**Course Management:** add/edit/delete course

**Team Management:** add/edit/delete team profile

**Testimonials:** add/edit/delete




### Admin Security (NEW — was completely unspecified for a dashboard holding personal applicant data)




- Admin login must be a **separate authenticated route**, not publicly linked from the main nav

- Use proper password hashing (handled automatically by Supabase Auth if used) — never store plaintext credentials

- Consider **2FA** for admin login given it exposes applicant resumes and contact details

- Role-based access if more than one admin/team member will use the dashboard

- Resume downloads and applicant data views should be logged (basic audit trail)




---




# 15. Design Requirements




Premium startup/technology aesthetic: modern SaaS, clean, professional, minimal, high-end. Use glassmorphism where appropriate, smooth gradients, rounded cards, soft shadows, micro-interactions, hover animations, scroll animations, smooth transitions, responsive design.




Do NOT make the website look like a generic template.




---




# 16. Responsive Design




Must work on desktop, laptop, tablet, mobile. Hamburger menu on mobile nav. Job cards stack on mobile. Application forms mobile-friendly.




**Breakpoints (NEW — for buildability):** mobile <640px, tablet 640–1024px, desktop >1024px (standard Tailwind breakpoints if using that stack).




---




# 17. SEO




Page titles, meta descriptions, Open Graph metadata, favicon, sitemap.xml, robots.txt, semantic HTML, structured data (JSON-LD) for **Organization** and **JobPosting** schema types — this last one matters if the goal is for job listings to potentially surface in Google's job search results.




Keywords: MastCode, MastCode Careers, MastCode Jobs, Technology Education, Coding Courses, AI ML Courses, Software Development Training, Developer Jobs, Technology Internships, Bangalore Technology Jobs.




---




# 18. LinkedIn Sharing




Title: **MastCode | CODE · BUILD · GROW**

Description: **MastCode is a technology education and career platform helping learners build practical skills, real-world projects, and successful technology careers.**




Create a professional Open Graph preview image (1200×630px is the standard OG image size — worth specifying so it renders correctly on LinkedIn).




---




# 19. Important Functionality




Working navigation, job search, job category filters, Apply Now flow, resume upload, contact form, admin authentication, database integration, form validation, error handling, success notifications, loading states, mobile responsiveness.




### Additional production-readiness items (NEW)




- **404 / error page** — a real production site needs one

- **Environment variables** for all API keys/secrets (Supabase keys, email service keys) — never hardcoded in the frontend

- **Rate limiting** on form submissions to prevent abuse

- **Loading skeletons** (not just spinners) for job listings and course cards for a more polished feel

- **Analytics** — Google Analytics or Plausible to track applicant funnel (view job → click apply → submit)




Do not use fake buttons that do nothing.




Where backend services are required, use Supabase (per Section 0) for database, auth, and file storage.




---




# 20. Final Goal




MastCode is not just a course website — it is a **technology education + practical learning + career development platform**. The site should be professional enough to share on LinkedIn as the official MastCode company/careers website, with its own branding and identity, while matching the polish of a modern technology startup careers site.


MASTCODE — FULL-STACK WEBSITE + ADMIN CMS + DATABASE

You are an expert senior full-stack engineer, UI/UX designer, database architect, cybersecurity engineer, and product designer.

I already have an existing MastCode Careers website project.

DO NOT throw away the existing project.

First inspect the existing codebase and understand its current structure, components, routes, styling, dependencies, and functionality.

Then upgrade the existing project into a complete, production-quality MastCode Education + Careers + Internship Platform.

The final product must feel like a serious modern technology startup, not a basic template.

1. CORE OBJECTIVE

MastCode is a technology education and career platform.

The platform must allow:

Public users

View the MastCode website

View courses

View internships

View jobs

View projects

View announcements

View company information

View team

Submit applications

Submit contact forms

Register/login if required

Admin

The MastCode administrator must have a secure private dashboard where they can manage the entire website without changing code.

The admin must be able to:

Add courses

Edit courses

Delete courses

Publish/unpublish courses

Add internships

Edit internships

Delete internships

Publish/unpublish internships

Add jobs

Edit jobs

Delete jobs

Publish/unpublish jobs

Add projects

Edit projects

Add announcements

Manage applicants

Manage users

Manage team members

Manage testimonials

Manage website content

Upload images

Upload documents

Upload resumes

View statistics

Manage categories

Manage skills

Manage application statuses

Whenever the admin updates published content, the changes must automatically appear on the public website.

2. ADMIN LOGIN

Create a completely separate secure admin authentication system.

Admin route:

/admin/login

Do NOT expose the admin dashboard publicly.

Admin login page should be extremely attractive.

Design:

Dark premium technology interface

MastCode logo

Animated background

Subtle particles/grid

Glassmorphism login card

Email field

Password field

Show/hide password

Remember session

Forgot password

Login button

Loading animation

Error messages

Success notification

After successful login:

/admin/dashboard

Unauthorized users must automatically be redirected to:

/admin/login

Never allow users to access admin pages simply by typing the URL.

3. ADMIN DASHBOARD

Create a premium SaaS-style admin dashboard.

Sidebar:

Dashboard
Content
Courses
Internships
Jobs
Projects
Applications
Users
Team
Testimonials
Announcements
Media
Categories
Skills
Messages
Analytics
Settings

Top navigation:

Search

Notifications

Admin profile

Logout

Dashboard cards:

Total Users
Total Applications
Active Internships
Active Jobs
Published Courses
Total Courses
Unread Messages
New Applications

Include attractive charts:

Applications over time

Users over time

Internship applications

Job applications

Course registrations

Most popular courses

Use modern interactive charts.

4. DATABASE ARCHITECTURE

Create a proper scalable database structure.

The database must NOT simply store everything in one giant table.

Create separate tables/entities for:

users
admins
roles
permissions
courses
course_categories
course_modules
course_lessons
course_resources
internships
internship_skills
jobs
job_skills
projects
project_categories
applications
application_documents
application_status_history
team_members
testimonials
announcements
messages
media
categories
skills
notifications
settings
audit_logs

Use proper relationships, indexes, timestamps, foreign keys and constraints.

Every major table should have:

id
created_at
updated_at

Use UUIDs or another scalable ID strategy.

5. LARGE DATA REQUIREMENT

The website must be designed to handle a LARGE amount of data.

Do not load everything into the browser at once.

Implement:

Pagination

Server-side pagination

Search

Filtering

Sorting

Lazy loading

Database indexes

Efficient queries

Query limits

Caching where appropriate

Image optimization

File storage

Infinite scrolling where useful

Admin tables must support:

10
50
100
250
500

items per page where appropriate.

The architecture should be capable of growing from hundreds to thousands or more records without becoming unusably slow.

6. DATABASE / BACKEND FOLDER STRUCTURE

Create a clean backend/database architecture.

Example:

database/
├── schema/
├── migrations/
├── seed/
├── queries/
└── README.md

server/
├── routes/
├── controllers/
├── services/
├── middleware/
├── auth/
├── validators/
└── utils/

Do not put database logic directly inside UI components.

Use a clean separation:

UI
↓
API
↓
Service layer
↓
Database

7. COURSE MANAGEMENT

Admin must be able to create a course.

Course fields:

Course title
Slug
Short description
Full description
Thumbnail
Banner image
Instructor
Category
Level
Duration
Price
Discount price
Language
Course status
Featured
Published date

Course modules:

Module title
Module description
Lessons

Lesson fields:

Lesson title
Video URL
Description
Duration
Resources
Assignment
Quiz

Admin buttons:

Save Draft
Publish
Unpublish
Preview
Edit
Delete

Public users should immediately see published courses.

8. INTERNSHIP MANAGEMENT

Create a complete internship management system.

Admin can:

Add Internship
Edit Internship
Delete Internship
Publish
Unpublish
Close Internship
Duplicate Internship

Fields:

Internship title
Slug
Department
Description
Responsibilities
Requirements
Skills
Duration
Stipend
Location
Work mode
Eligibility
Application deadline
Number of openings
Experience level
Company information
Application link/form
Featured image
Status

Statuses:

Draft
Published
Closed
Archived

Public page:

/internships

Individual page:

/internships/:slug

Users can click:

APPLY NOW

and submit an application.

9. JOB MANAGEMENT

Create:

/careers

Admin can create job openings.

Fields:

Job title
Department
Location
Work mode
Employment type
Experience
Salary range
Description
Responsibilities
Requirements
Skills
Benefits
Application deadline
Number of openings
Status

Types:

Full-time
Part-time
Internship
Contract
Freelance

Users can search/filter jobs.

Filters:

Department
Location
Experience
Job type
Work mode

10. APPLICATION MANAGEMENT

Create a powerful admin application management system.

Admin can see:

Candidate name
Email
Phone
Position
Application type
Applied date
Status
Resume
LinkedIn
GitHub

Statuses:

Applied
Under Review
Shortlisted
Interview Scheduled
Selected
Rejected
Withdrawn

Admin can:

View application
Download resume
View candidate profile
Change status
Add internal notes
Contact candidate
Delete application

Maintain status history.

11. RESUME / FILE UPLOAD

Allow users to upload:

PDF
DOC
DOCX

Validate:

File type
File size
Filename

Store files securely.

Do not expose private resumes through public URLs.

Only authorized admins should be able to access candidate documents.

12. MEDIA MANAGEMENT

Create an admin Media Library.

Admin can upload:

Images
Logos
Course thumbnails
Internship images
Job images
Team photos
Certificates
PDF resources

Features:

Upload
Preview
Search
Filter
Delete
Copy file reference

Optimize large images automatically.

Do not store large binary files directly inside database tables.

Use proper file/object storage architecture.

13. PUBLIC WEBSITE

Redesign the public website to be MUCH more attractive.

The current interface feels dull.

Completely improve the visual design while preserving useful existing functionality.

Design direction:

Premium technology startup
Modern SaaS
Futuristic
Professional
Clean
High-end
Responsive

Use:

Glassmorphism
Gradient backgrounds
Soft shadows
Modern typography
Beautiful cards
Micro-interactions
Hover effects
Smooth scrolling
Scroll reveal animations
Animated counters
Subtle background effects
Modern icons
Professional illustrations

Do not overuse animations.

The website must remain fast.

14. HOMEPAGE

Hero:

CODE · BUILD · GROW

Subtitle:

MastCode helps students and aspiring technology professionals develop practical skills, build real-world projects, and discover career opportunities.

Buttons:

Explore Courses
Explore Careers

Hero visual:

AI
Coding
Cloud
Data
Software development
Career growth

15. LIVE CONTENT

IMPORTANT:

Do not hardcode courses, internships, jobs or announcements into the frontend.

All dynamic content must come from the database/API.

Example:

Admin creates:

"AI/ML Internship — 2026"

Admin clicks:

PUBLISH

It must automatically appear on:

Homepage
Internships page
Search results
Featured section if selected

If admin changes:

"Stipend ₹10,000"

The public website should automatically show the updated information.

If admin closes the internship:

It should disappear from active internship listings and display as closed where appropriate.

16. ADMIN CONTENT EDITOR

Create a simple editor for admins.

Admin should NOT need coding knowledge.

For descriptions use a rich text editor supporting:

Bold
Italic
Headings
Lists
Links
Images
Tables
Quotes
Code blocks

Allow preview before publishing.

Buttons:

Save Draft
Preview
Publish
Update

17. ANNOUNCEMENTS

Admin can create announcements.

Example:

"New Python Internship Applications Open!"

Fields:

Title
Description
Image
Category
Publish date
Expiry date
Status

Display announcements on the homepage.

Allow:

Featured announcement
Popup announcement
Announcement banner

18. SEARCH SYSTEM

Create global search.

Users can search:

Courses
Internships
Jobs
Projects
Announcements

Search should have:

Autocomplete
Categories
Filters
Fast results

Admin should also have search across:

Users
Applications
Courses
Internships
Jobs
Messages

19. USER ACCOUNTS

Create user authentication.

User can:

Register
Login
Logout
Forgot password
Reset password
Update profile

Profile:

Name
Email
Phone
Location
Education
Skills
LinkedIn
GitHub
Portfolio
Resume

Dashboard:

My Applications
Saved Jobs
Saved Internships
Courses
Profile

20. SECURITY

Implement proper security.

Requirements:

Password hashing
Secure authentication
Session management
Role-based authorization
Admin-only routes
Input validation
API validation
Rate limiting where appropriate
CSRF protection where applicable
Secure file uploads
SQL injection protection
XSS protection
Environment variables
No secrets in frontend
No hardcoded database passwords
Audit logs

Never store plaintext passwords.

21. ADMIN ROLES

Support:

Super Admin
Content Manager
Recruiter
Trainer

Permissions should control what each role can access.

Example:

Recruiter:
Applications
Jobs
Internships

Content Manager:
Courses
Announcements
Projects

Super Admin:
Everything

22. ADMIN SETTINGS

Create settings page.

Admin can manage:

Company name
Logo
Favicon
Email
Phone
Address
Social links
LinkedIn
Instagram
YouTube
GitHub
SEO title
SEO description
Footer text

23. ANALYTICS

Admin dashboard should display:

Visitors
Users
Applications
Courses
Internships
Jobs

Charts:

Daily
Weekly
Monthly
Yearly

Add date filters.

24. NOTIFICATIONS

Admin notifications:

New application
New user
New contact message
Internship application
Job application

Public/user notifications:

Application status changed
New internship
New job
New course

25. UI/UX QUALITY

The website must NOT look dull.

Use a strong visual hierarchy.

Cards should have:

subtle hover movement

clean spacing

attractive icons

clear typography

meaningful CTA buttons

Buttons should feel premium.

Use skeleton loading states instead of blank screens.

Use toast notifications.

Use empty states.

Use confirmation dialogs before destructive actions.

Example:

"Are you sure you want to delete this internship?"

26. MOBILE DESIGN

Perfectly support:

Mobile
Tablet
Laptop
Desktop

Admin dashboard must also work on mobile.

Use:

Responsive sidebar
Mobile navigation
Responsive tables
Horizontal table scrolling where required
Responsive cards

27. SEO

Implement:

SEO metadata
Open Graph
Twitter cards
Canonical URLs
Sitemap
Robots.txt
Structured data

Add Organization schema.

Add JobPosting schema for jobs.

Add Course schema where appropriate.

Dynamic metadata should be generated for:

Courses
Jobs
Internships
Projects

28. LINKEDIN SHARING

Every job/internship/course page should generate a professional preview when shared on LinkedIn.

Example:

Title:

MastCode — AI/ML Internship

Description:

Join MastCode and gain practical experience working on real-world AI and machine learning projects.

Use dynamic Open Graph images.

29. PERFORMANCE

Optimize for:

Fast initial loading
Code splitting
Lazy loading
Image compression
Caching
Efficient database queries
Minimal unnecessary API calls

Do not sacrifice performance for animations.

30. ERROR HANDLING

Every API should have proper:

Success responses
Validation errors
Authentication errors
Authorization errors
Not found errors
Server errors

Frontend should show friendly messages.

Never show raw database errors to users.

31. DEVELOPMENT QUALITY

Use:

TypeScript
Clean component architecture
Reusable components
Reusable forms
Reusable tables
Reusable modal components
Reusable API clients
Centralized validation
Environment variables

Avoid:

Duplicate code
Hardcoded dynamic content
Huge components
Database logic in frontend
Exposed secrets

32. ENVIRONMENT CONFIGURATION

Create:

.env.example

Include placeholders for:

DATABASE_URL
AUTH_SECRET
STORAGE_URL
STORAGE_KEY
API_URL

Never commit actual secrets.

Create clear README instructions explaining:

Installation
Environment variables
Database setup
Migration
Seeding
Development
Production build
Deployment

33. DEMO DATA

Create realistic seed data.

Courses:

Python Programming
SQL & Database Management
Full Stack Development
Artificial Intelligence
Machine Learning
Data Analytics

Internships:

AI/ML Intern
Full Stack Developer Intern
Web Developer Intern
Digital Marketing Intern
Data Analyst Intern

Jobs:

AI Developer
Full Stack Developer
Software Developer
Technical Trainer

Create sample applications and testimonials.

34. ADMIN DEMO ACCOUNT

For local development only, create a seed/admin setup.

DO NOT hardcode a production password into frontend code.

Use environment variables or secure seed configuration.

Clearly document how to create the first admin account.

35. IMPORTANT EXISTING PROJECT RULE

You are modifying an EXISTING MastCode project.

Before making changes:

Inspect all existing files.

Identify current framework.

Identify current routes.

Identify current database setup.

Identify current components.

Preserve useful existing code.

Reuse existing design assets where appropriate.

Do not unnecessarily replace the entire project.

Then implement the new architecture cleanly.

36. FINAL TESTING

Before declaring the project complete, test:

Admin login
Admin logout
Protected routes
Create course
Edit course
Delete course
Publish course
Create internship
Edit internship
Publish internship
Close internship
Create job
Publish job
Application submission
Resume upload
Application management
User registration
User login
Search
Filters
Admin permissions
Mobile responsiveness
Database connection
API errors
Empty states
Loading states

Fix all major runtime errors.

37. FINAL RESULT

The final MastCode platform should feel like a combination of:

Modern startup website
+
Learning platform
+
Careers portal
+
Internship portal
+
Recruitment system
+
Admin CMS
+
Scalable database

The most important requirement:

ADMIN UPDATES MUST REFLECT ON THE PUBLIC WEBSITE AUTOMATICALLY.

I should be able to log into:

/admin/login

and manage MastCode without touching the source code.

Make the interface visually impressive, professional, modern, responsive and suitable for showcasing publicly on LinkedIn.

Do not stop after creating the UI.

Implement the backend, database architecture, authentication, API layer, admin functionality, validation and integration required for the features above.

If a specific external service is required, create the correct integration structure and clearly document the required environment variables instead of pretending it is connected.

Build this systematically in phases and keep the existing project functional after every phase.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/66d8816f-e3f9-4aa7-967e-d7d5f00477eb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
