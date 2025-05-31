# User Stories

**Original Estimation:** 2 hours

## Authentication
1.  **As a new user, I want to be able to sign up with my email and password so that I can access the application.**
    *   *Acceptance Criteria:*
        *   User can navigate to a sign-up page.
        *   User provides a valid email and a strong password.
        *   Upon successful sign-up, the user is logged in and redirected to the dashboard.
        *   Clerk handles user creation.
2.  **As an existing user, I want to be able to log in with my email and password so that I can access my account.**
    *   *Acceptance Criteria:*
        *   User can navigate to a login page.
        *   User provides correct credentials.
        *   Upon successful login, the user is redirected to the dashboard.
        *   Clerk handles user authentication.
3.  **As a logged-in user, I want to be able to log out so that I can securely end my session.**
    *   *Acceptance Criteria:*
        *   User can find and click a logout button.
        *   Upon logout, the user session is terminated, and they are redirected to the login or home page.
4.  **As a user, I want to be able to reset my password if I forget it so that I can regain access to my account.**
    *   *Acceptance Criteria:*
        *   User can request a password reset link via email.
        *   User receives an email with instructions.
        *   User can set a new password.

## User Profile Management (Example)
5.  **As a logged-in user, I want to be able to view my profile information so that I can see my details.**
    *   *Acceptance Criteria:*
        *   User can navigate to a profile page.
        *   Profile page displays user information (e.g., name, email) from Clerk/Supabase.
6.  **As a logged-in user, I want to be able to update my profile information (e.g., name) so that my details are current.**
    *   *Acceptance Criteria:*
        *   User can edit fields on the profile page.
        *   Changes are saved to Supabase and reflected in Clerk where applicable.

## Core Feature: Task Management (Example - Adapt to your project)
7.  **As a logged-in user, I want to be able to create a new task with a title and description so that I can track my to-dos.**
    *   *Acceptance Criteria:*
        *   User can access a form to create a new task.
        *   Task is saved to the Supabase database with the user_id.
        *   The new task appears in the task list.
8.  **As a logged-in user, I want to be able to see a list of all my tasks so that I can manage them.**
    *   *Acceptance Criteria:*
        *   Tasks are fetched from Supabase and displayed.
        *   Only tasks belonging to the logged-in user are shown.
9.  **As a logged-in user, I want to be able to mark a task as complete so that I can track my progress.**
    *   *Acceptance Criteria:*
        *   User can toggle the completion status of a task.
        *   Status change is saved to Supabase.
10. **As a logged-in user, I want to be able to delete a task so that I can remove unwanted items.**
    *   *Acceptance Criteria:*
        *   User can delete a task.
        *   Task is removed from Supabase and the UI.

## General
11. **As a user, I want the application to be responsive so that I can use it effectively on different devices (desktop, tablet, mobile).**
    *   *Acceptance Criteria:*
        *   UI adapts to various screen sizes.
        *   Key functionalities are accessible on all supported devices.

---
*Note: These are example user stories. Please adapt and expand them based on your specific project requirements.*
