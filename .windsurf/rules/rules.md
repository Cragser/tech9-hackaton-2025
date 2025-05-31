---
trigger: always_on
---

Project Description
1.1. The main goal is to build a solution (application, prototype, or feature) that addresses the challenges posed by the organizers during the hackathon.
1.2. Judges will be experienced developers located in India, Latin America, and possibly the United States. They will evaluate technical functionality, code quality, and creativity.
1.3. There are 10 participating teams; each team will present their proposal and demonstrate its functionality to the judges.

Hackathon Objectives
2.1. Encourage collaboration and learning among developers from different regions.
2.2. Develop innovative solutions to real problems (API integrations, process optimizations, etc.).
2.3. Emphasize best coding practices, minimal documentation, and scalability.
2.4. Share technical knowledge: each team can showcase their chosen technologies, libraries, and design patterns.

Recommended Stack
3.1. Services
• Clerk for authentication and user management (https://clerk.com/docs)
• Supabase for database and backend-as-a-service (https://supabase.com/docs)
3.2. Frameworks & Libraries
• Next.js (App Router) (https://nextjs.org/docs)
• ShadCN UI (https://ui.shadcn.com/docs/installation)
• React Query (https://tanstack.com/query/latest/docs/framework/react/overview)
• React Hook Form (https://www.react-hook-form.com/get-started/)
• @tanstack/react-table for tables (https://tanstack.com/table/latest/docs/introduction)
• Dnd-kit for drag-and-drop (https://docs.dndkit.com/)
• Zod for schema validation (https://zod.dev/)
• Zustand for global state management (https://zustand.docs.pmnd.rs/getting-started/introduction)
• date-fns for date handling (https://date-fns.org/docs/Getting-Started)
• Framer Motion for animations (https://motion.dev/docs/react-quick-start)
3.3. Testing
• Jest (unit tests)
• Testing Library (https://testing-library.com/docs/)
• MSW (Mock Service Worker) (https://mswjs.io/)
• Playwright for end-to-end tests (https://playwright.dev/)
3.4. Utilities
• TypeScript 5.7 (strict, no any; use unknown or generics when needed)
• Standard ESLint and Prettier configuration
3.5. Deployment
• Vercel (hosting for Next.js)
• GitHub (repositories and CI/CD workflows)

Minimum Deliverables
4.1. Source code in a repository (GitHub/GitLab) with a clear commit history.
4.2. A README.md explaining installation and run instructions.
4.3. A short presentation (max 5 minutes) including:
• Problem statement
• Technical solution (architecture and main workflow)
• Functional demo

Mandatory Best Practices
5.1. Validation & Typing
• In TypeScript, avoid any; use proper types, generics, or unknown.
• Use Zod (or similar) to validate inputs before processing data.
5.2. Structure & Modularity
• Break down complex logic into separate functions or modules.
• Create reusable, decoupled React components.
5.3. Minimal Documentation
• Write comments in English at the top of complex functions (briefly explain purpose and parameters).
• Configure ESLint and Prettier for consistent style.
5.4. Testing
• Write at least 3–5 unit tests with Jest and Testing Library for critical functions.
• Mock external calls using MSW.
• Optional: add 1–2 end-to-end tests with Playwright for key flows (e.g., sign-up, login, main feature).

Evaluation Criteria
6.1. Functionality (40%)
• Does the solution meet the challenge requirements?
• Do core flows (sign-up/login, main operations) work without major errors?
6.2. Code Quality (30%)
• Readability, English comments, and modular structure.
• Correct use of TypeScript types.
6.3. Innovation & Creativity (20%)
• Original approach to solving the problem.
• Practical and novel use of the recommended stack.
6.4. Documentation & Presentation (10%)
• Clear and complete README.md.
• Concise presentation highlighting added value and challenges overcome.

General Rules
7.1. Time
• Duration: 48 hours (start and end times will be communicated in UTC–5).
7.2. Team Composition
• Up to 5 members per team.
• Open-source code usage is allowed (credit must be given in README.md).
7.3. Intellectual Property
• Each team retains ownership of its code.
• By presenting, teams agree that judges may review the repository and share snippets for learning.
7.4. Ethics
• Plagiarizing complete solutions from third parties is prohibited.
• Teams should not share their code with other teams before final submission.
7.5. Communication
• All announcements and clarifications will be posted on the official channel (Slack/Discord).
• Judges may ask technical questions during submission (Q&A session).

Role of Judges and Evaluators
8.1. Judges are experienced software developers.
8.2. Each project will be reviewed by at least two judges to ensure impartiality.
8.3. Judges will review:
• Commit history and documentation.
• Live or recorded demo: core workflows and use cases.
• Code quality: readability, modularity, validations, and tests.
8.4. A brief 5-minute interview per team will allow judges to discuss architectural decisions and algorithm design.

Final Submission & Presentation
9.1. Each team must submit the repository link and schedule a demo (maximum 5 minutes).
9.2. During the demo:
• Show the core workflow (login, main operations, data handling).
• Briefly explain the architecture (folder structure, key code areas, dependencies).
9.3. It is recommended to prepare a short slide deck (3–5 slides) covering:
• Problem statement
• Proposed solution (high-level diagram if applicable)
• Technologies used (briefly list the stack)
• Lessons learned or challenges overcome

Support During the Hackathon
10.1. Mentors/Tutors
• Specific hours (India, Latin America, U.S.) when mentors will be available for technical questions.
• Real-time support channels on Slack/Discord.
10.2. Shared Resources
• Template repository with setup examples (Next.js, ESLint, Prettier, optional Docker).
• README.md and slide deck templates.
• Example unit tests with Jest and end-to-end tests with Playwright.
