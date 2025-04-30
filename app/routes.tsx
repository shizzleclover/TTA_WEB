/**
 * Text the Answer - Application Routes
 *
 * This file lists all the routes available in the application.
 * It's for documentation purposes only and is not used in the actual routing.
 */

const routes = {
  // Public Routes
  public: [
    { path: "/", description: "Landing page with feature overview and pricing" },
    { path: "/login", description: "User login page" },
    { path: "/register", description: "User registration page" },
    { path: "/forgot-password", description: "Password reset request page" },
    { path: "/reset-password", description: "Password reset confirmation page" },
    { path: "/demo", description: "Demo quiz experience for non-registered users" },
    { path: "/terms", description: "Terms of service page" },
    { path: "/privacy", description: "Privacy policy page" },
  ],

  // Authenticated Routes
  authenticated: [
    // Dashboard
    { path: "/dashboard", description: "User dashboard with overview and stats" },

    // Quiz Routes
    { path: "/quiz/daily", description: "Daily quiz page" },
    { path: "/quiz/[id]", description: "Specific quiz by ID" },
    { path: "/quiz/results/[id]", description: "Results page for a completed quiz" },

    // Multiplayer Routes
    { path: "/multiplayer", description: "Multiplayer lobby browser" },
    { path: "/multiplayer/create", description: "Create a new multiplayer lobby" },
    { path: "/multiplayer/join/[code]", description: "Join a specific multiplayer lobby" },
    { path: "/multiplayer/game/[id]", description: "Active multiplayer game" },

    // Leaderboard Routes
    { path: "/leaderboards", description: "Leaderboards page with filters" },
    { path: "/leaderboards/daily", description: "Daily leaderboard" },
    { path: "/leaderboards/weekly", description: "Weekly leaderboard" },
    { path: "/leaderboards/all-time", description: "All-time leaderboard" },

    // Study Materials
    { path: "/study", description: "Study materials management" },
    { path: "/study/[id]", description: "View specific study material" },
    { path: "/study/quiz/[id]", description: "Quiz generated from study material" },

    // User Profile
    { path: "/profile", description: "User profile page" },
    { path: "/profile/edit", description: "Edit user profile" },
    { path: "/profile/settings", description: "User settings" },

    // Subscription Management
    { path: "/subscription", description: "Subscription management page" },
    { path: "/subscription/checkout", description: "Checkout page for subscription" },
    { path: "/subscription/success", description: "Subscription success confirmation" },
    { path: "/subscription/cancel", description: "Subscription cancellation page" },

    // Student Verification
    { path: "/verify-student", description: "Student verification page" },
    { path: "/verify-student/confirm", description: "Student verification confirmation page" },
    { path: "/verify-student/success", description: "Student verification success page" },
  ],

  // Admin Routes (for platform administrators)
  admin: [
    { path: "/admin", description: "Admin dashboard" },
    { path: "/admin/users", description: "User management" },
    { path: "/admin/quizzes", description: "Quiz management" },
    { path: "/admin/categories", description: "Category management" },
    { path: "/admin/reports", description: "Platform reports and analytics" },
  ],
}

export default routes
