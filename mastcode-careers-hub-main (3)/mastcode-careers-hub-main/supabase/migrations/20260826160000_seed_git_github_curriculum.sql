UPDATE public.courses
SET title = 'Git & GitHub',
    short_description = 'Learn Git and GitHub from fundamentals to professional project collaboration, branching, pull requests, and portfolio management.',
    full_description = 'Learn Git and GitHub from the fundamentals to professional project collaboration. This 4-week program teaches students how to manage code, track changes, create branches, collaborate with teams, resolve conflicts, work with remote repositories, create professional GitHub profiles and maintain portfolio-ready projects.',
    level = 'Beginner', duration = '1 Month | 4 Weeks', published_at = COALESCE(published_at, now())
WHERE slug = 'git-github';

INSERT INTO public.course_weeks (course_id, week_number, month_number, title, topics, practical_task, assignment, mini_project, expected_outcome)
SELECT c.id, v.week_number, 1, v.title, v.topics, v.practical_task, v.assignment, v.mini_project, v.expected_outcome
FROM public.courses c
CROSS JOIN (VALUES
(1,'Git Fundamentals',ARRAY['What is Version Control?','Why Git is used','Git vs GitHub','Installing Git','Git configuration','Git Bash / Terminal','Creating a Git repository','git init','git status','git add','git commit','Commit messages','Viewing commit history','git log','Working directory','Staging area','Local repository']::text[],'Initialize a small project, stage files, create commits, view history, modify files, and commit changes again.','Create a personal project repository and maintain at least 5 meaningful commits.',NULL,'Use Git locally to track changes with clear, useful commit history.'),
(2,'GitHub & Remote Repositories',ARRAY['What is GitHub?','Creating a GitHub account','Creating repositories','Public vs private repositories','Connecting local Git to GitHub','git remote','git push','git pull','git fetch','git clone','README files','.gitignore','Repository organization','GitHub profile basics']::text[],'Create a GitHub repository, connect it locally, push updates, clone it, and pull changes.',NULL,'Create a professional GitHub repository with a README, installation instructions, technologies, screenshots, project structure, and usage instructions.','Manage remote repositories and present projects professionally on GitHub.'),
(3,'Branching & Team Collaboration',ARRAY['Why branches are used','Creating branches','git branch','git checkout','git switch','Merging branches','git merge','Branch naming conventions','Feature branches','Main/master branch','Pull Requests','Code review','GitHub Issues','GitHub Projects','Collaboration workflow']::text[],'Practice main → feature branch → development → Pull Request → Review → Merge.',NULL,'Work in a team repository and complete a feature using a separate branch.','Collaborate through branches, pull requests, reviews, issues, and merges.'),
(4,'Advanced Git & Professional Workflow',ARRAY['Merge conflicts','Resolving conflicts','git diff','git stash','git reset','git revert','Undoing changes safely','Commit best practices','Branch management','Tags','Releases','GitHub Actions introduction','GitHub security basics','Professional repository management','Open-source contribution basics']::text[],'Intentionally create a merge conflict, resolve it, commit the resolution, push changes, and complete the pull request.','Create a Professional GitHub Portfolio Repository with at least two projects, documentation, screenshots, clean structure, issues, and a branching workflow.','Professional GitHub Portfolio Repository','Resolve conflicts safely and maintain a portfolio-ready collaborative repository.')
) AS v(week_number, title, topics, practical_task, assignment, mini_project, expected_outcome)
WHERE c.slug = 'git-github'
ON CONFLICT (course_id, week_number) DO UPDATE SET
  month_number = EXCLUDED.month_number, title = EXCLUDED.title, topics = EXCLUDED.topics,
  practical_task = EXCLUDED.practical_task, assignment = EXCLUDED.assignment,
  mini_project = EXCLUDED.mini_project, expected_outcome = EXCLUDED.expected_outcome, updated_at = now();
