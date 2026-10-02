UPDATE public.courses
SET title = 'Git & GitHub',
    short_description = 'Learn Git and GitHub workflows, build a documented project portfolio, and present your work professionally on LinkedIn in two practical days.',
    full_description = 'Learn version control with Git, publish and document projects on GitHub, and present your work through LinkedIn. This two-day practical course covers commits, branches, pull requests, conflict resolution, repository documentation, profile security, and connecting project work to a professional LinkedIn profile.',
    level = 'Beginner',
    duration = '2 Days',
    price = 1000,
    discount_price = 1000,
    published_at = COALESCE(published_at, now())
WHERE slug = 'git-github';

DELETE FROM public.course_weeks
WHERE course_id = (SELECT id FROM public.courses WHERE slug = 'git-github');

INSERT INTO public.course_weeks (course_id, week_number, month_number, title, topics, practical_task, assignment, mini_project, expected_outcome)
SELECT c.id, v.day_number, 1, v.title, v.topics, v.practical_task, v.assignment, v.mini_project, v.expected_outcome
FROM public.courses c
CROSS JOIN (VALUES
(1, 'Day 1: Git Foundations and Publishing on GitHub', ARRAY['Version control concepts and why teams use Git','Git vs GitHub','Install Git and configure name and email','Terminal basics and navigating project folders','Initialize a repository with git init','Working tree, staging area, and repository','git status, git add, and git commit','Writing clear commit messages','Inspecting history with git log','Reviewing changes with git diff','Ignoring generated files with .gitignore','Creating a GitHub account and choosing public or private repositories','Create a remote repository and connect it with git remote','Clone, push, pull, and fetch','Write a useful README with setup, features, and screenshots','Set repository visibility and verify the published project']::text[], 'Build a small personal project, make meaningful commits, publish it to GitHub, and write a README with setup steps and screenshots.', 'Finish a clean, public project repository with a descriptive name, README, .gitignore, and at least five meaningful commits.', NULL, 'Track project changes with Git and publish a documented project to GitHub.'),
(2, 'Day 2: Collaboration, Portfolio and LinkedIn', ARRAY['Create and switch branches with git branch and git switch','Merge a feature branch and resolve a merge conflict','Undo changes safely with git restore, git revert, and git stash','Open a GitHub pull request and review proposed changes','Use issues and project boards to track work','Fork a repository and understand the open-source contribution flow','Use tags and releases to mark a project version','GitHub profile README and pinned repositories','Account security, two-factor authentication, and safe token handling','Plan a portfolio with clear project evidence','Set up a LinkedIn profile for a technology career','Write a focused headline and About summary','Add relevant skills, education, and project experience','Add GitHub projects to LinkedIn Featured with links and context','Write a concise project description with the problem, tools, and result','Check profile links, spelling, visibility, and consistency']::text[], 'Create a feature branch and pull request, then update LinkedIn with a clear headline, About section, relevant skills, and a Featured link to the GitHub project.', 'Submit your GitHub repository URL and LinkedIn profile URL; verify both are viewable and the project description explains your contribution.', 'A GitHub portfolio repository presented through a complete LinkedIn project entry.', 'Demonstrate a collaborative Git workflow and connect documented GitHub work to a professional LinkedIn profile.')
) AS v(day_number, title, topics, practical_task, assignment, mini_project, expected_outcome)
WHERE c.slug = 'git-github';