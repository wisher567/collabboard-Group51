const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'default-user',
      unique: true,
    },
    profile: {
      fullName: {
        type: String,
        default: 'Alex Johnson',
      },
      displayHandle: {
        type: String,
        default: '@alexj',
      },
      email: {
        type: String,
        default: 'alex.johnson@company.com',
      },
      emailVerified: {
        type: Boolean,
        default: true,
      },
      role: {
        type: String,
        default: 'Senior Product Designer',
      },
      timezone: {
        type: String,
        default: '(UTC-08:00) Pacific Time (US & Canada)',
      },
      bio: {
        type: String,
        default: 'Leading Q3 Marketing & Product redesign sprints.',
      },
      avatarUrl: {
        type: String,
        default:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDgpAuTfntSDT6BFvCebsYZrAyxP0sDz1V8UqyXlEwardJaSKEJr5PaPbRc0gvvghe2XeQs-kF7MKoi4JrauhFJNVtjUzwIrAJYZO2KQYSoIkSHNVD8OlusV9e2wCWDBTjwRdoMw6v3wLSuj3mwi_SCCRWNO0zBM2ehwgJdxGh8aKPs7Xpc3vwWHJO0aMhYShJunifX6K6XILukCaG5GR0JBMuTc7HtzuGNou4ibDl6_BZabiKZf4Vj',
      },
      activitySpark: {
        type: [Number],
        default: [3, 5, 7, 4, 6],
      },
    },
    collaboration: {
      presenceIndicators: {
        type: Boolean,
        default: true,
      },
      conflictWarnings: {
        type: Boolean,
        default: true,
      },
      defaultLandingView: {
        type: String,
        default: 'Last Active Board',
      },
      compactCardDensity: {
        type: Boolean,
        default: false,
      },
    },
    notifications: {
      directAssignments: {
        type: Boolean,
        default: true,
      },
      mentions: {
        type: Boolean,
        default: true,
      },
      dueDateApproaching: {
        type: Boolean,
        default: true,
      },
      weeklySprintDigest: {
        type: Boolean,
        default: false,
      },
    },
    lastUpdated: {
      type: String,
      default: 'Today at 10:45 AM',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
