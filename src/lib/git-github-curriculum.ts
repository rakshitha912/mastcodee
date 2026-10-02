import type { CourseMonth } from "./course-curricula";

export const gitGithubCurriculum: CourseMonth[] = [
  { month: 1, monthName: "Git, GitHub & LinkedIn in 2 Days", weeks: [
    {
      title: "Day 1: Git Foundations and Publishing on GitHub",
      topics: ["Version control concepts and why teams use Git", "Git vs GitHub", "Install Git and configure name and email", "Terminal basics and navigating project folders", "Initialize a repository with git init", "Working tree, staging area, and repository", "git status, git add, and git commit", "Writing clear commit messages", "Inspecting history with git log", "Reviewing changes with git diff", "Ignoring generated files with .gitignore", "Creating a GitHub account and choosing public or private repositories", "Create a remote repository and connect it with git remote", "Clone, push, pull, and fetch", "Write a useful README with setup, features, and screenshots", "Set repository visibility and verify the published project"],
      practicalTask: "Build a small personal project, make meaningful commits, publish it to GitHub, and write a README with setup steps and screenshots. Finish Day 1 with a short mock interview on Git and GitHub fundamentals.",
      assignment: "Finish a clean, public project repository with a descriptive name, README, .gitignore, and at least five meaningful commits; note feedback from the Day 1 midpoint mock interview.",
      expectedOutcome: "Track project changes with Git and publish a documented project to GitHub."
    },
    {
      title: "Day 2: Collaboration, Portfolio, LinkedIn and Final Test",
      topics: ["Create and switch branches with git branch and git switch", "Merge a feature branch and resolve a merge conflict", "Undo changes safely with git restore, git revert, and git stash", "Open a GitHub pull request and review proposed changes", "Use issues and project boards to track work", "Fork a repository and understand the open-source contribution flow", "Use tags and releases to mark a project version", "GitHub profile README and pinned repositories", "Account security, two-factor authentication, and safe token handling", "Plan a portfolio with clear project evidence", "Set up a LinkedIn profile for a technology career", "Write a focused headline and About summary", "Add relevant skills, education, and project experience", "Add GitHub projects to LinkedIn Featured with links and context", "Write a concise project description with the problem, tools, and result", "Check profile links, spelling, visibility, and consistency"],
      practicalTask: "Create a feature branch and pull request, update LinkedIn with a clear headline, About section, relevant skills, and a Featured project link, then complete a practical test covering the full workflow.",
      miniProject: "A GitHub portfolio repository presented through a complete LinkedIn project entry.",
      assignment: "Submit your GitHub repository URL and LinkedIn profile URL; verify both are viewable and the project description explains your contribution. Complete a final test on Git commands, branching, pull requests, repository documentation, and presenting the project on LinkedIn.",
      expectedOutcome: "Demonstrate a collaborative Git workflow and connect documented GitHub work to a professional LinkedIn profile."
    },
  ] },
];
