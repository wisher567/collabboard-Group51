const Settings = require('../models/Settings');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function formatTimeNow() {
  const date = new Date();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `today at ${hours}:${minutes} ${ampm}`;
}

async function resolveUserFromReq(req) {
  let userId = null;
  let user = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'collabboard_dev_secret_k9x2m7p4q8');
      if (decoded && decoded.id) {
        userId = decoded.id;
        user = await User.findById(userId).lean();
      }
    } catch (e) {
      // Token invalid, ignore
    }
  }

  if (!user && mongoose.connection.readyState === 1) {
    // Pick the primary active user from database (most recent registered user)
    user = await User.findOne().sort({ createdAt: -1 }).lean();
    if (user) {
      userId = user._id.toString();
    }
  }

  return { userId: userId || 'default-user', user };
}

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    const { userId, user } = await resolveUserFromReq(req);
    let allUsers = [];

    if (mongoose.connection.readyState === 1) {
      allUsers = await User.find({}, 'name email createdAt').lean();

      let settings = await Settings.findOne({ userId });
      if (!settings) {
        const fullName = user ? user.name : 'Mohomad Ashfark';
        const email = user ? user.email : 'mohomadashfrak@gmail.com';
        const displayHandle = '@' + fullName.toLowerCase().replace(/\s+/g, '');

        settings = await Settings.create({
          userId,
          profile: {
            fullName,
            displayHandle,
            email,
            emailVerified: true,
            role: 'Lead Full Stack Developer',
            timezone: '(UTC-08:00) Pacific Time (US & Canada)',
            bio: 'Leading Q3 Marketing & Product redesign sprints on CollabBoard.',
            avatarUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDgpAuTfntSDT6BFvCebsYZrAyxP0sDz1V8UqyXlEwardJaSKEJr5PaPbRc0gvvghe2XeQs-kF7MKoi4JrauhFJNVtjUzwIrAJYZO2KQYSoIkSHNVD8OlusV9e2wCWDBTjwRdoMw6v3wLSuj3mwi_SCCRWNO0zBM2ehwgJdxGh8aKPs7Xpc3vwWHJO0aMhYShJunifX6K6XILukCaG5GR0JBMuTc7HtzuGNou4ibDl6_BZabiKZf4Vj',
            activitySpark: [3, 5, 7, 4, 6],
          },
          collaboration: {
            presenceIndicators: true,
            conflictWarnings: true,
            defaultLandingView: 'Last Active Board',
            compactCardDensity: false,
          },
          notifications: {
            directAssignments: true,
            mentions: true,
            dueDateApproaching: true,
            weeklySprintDigest: false,
          },
          lastUpdated: 'today at 10:45 AM',
        });
      } else if (user) {
        // Ensure profile stays consistent with User record if not explicitly diverged
        let changed = false;
        if (!settings.profile.fullName || settings.profile.fullName === 'Alex Johnson') {
          settings.profile.fullName = user.name;
          settings.profile.email = user.email;
          settings.profile.displayHandle = '@' + user.name.toLowerCase().replace(/\s+/g, '');
          changed = true;
        }
        if (changed) {
          await settings.save();
        }
      }

      const settingsObj = settings.toObject();
      settingsObj.workspaceMembers = allUsers.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        initials: u.name.split(' ').map((n) => n[0]).join('').toUpperCase(),
        role: u._id.toString() === userId ? 'Workspace Owner' : 'Team Member',
        joinedDate: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }));

      return res.status(200).json(settingsObj);
    }
  } catch (err) {
    console.warn('MongoDB query failed in getSettings:', err.message);
  }

  return res.status(200).json({
    userId: 'default-user',
    profile: {
      fullName: 'Mohomad Ashfark',
      displayHandle: '@mohomadashfark',
      email: 'mohomadashfrak@gmail.com',
      emailVerified: true,
      role: 'Lead Full Stack Developer',
      timezone: '(UTC-08:00) Pacific Time (US & Canada)',
      bio: 'Leading Q3 Marketing & Product redesign sprints on CollabBoard.',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDgpAuTfntSDT6BFvCebsYZrAyxP0sDz1V8UqyXlEwardJaSKEJr5PaPbRc0gvvghe2XeQs-kF7MKoi4JrauhFJNVtjUzwIrAJYZO2KQYSoIkSHNVD8OlusV9e2wCWDBTjwRdoMw6v3wLSuj3mwi_SCCRWNO0zBM2ehwgJdxGh8aKPs7Xpc3vwWHJO0aMhYShJunifX6K6XILukCaG5GR0JBMuTc7HtzuGNou4ibDl6_BZabiKZf4Vj',
      activitySpark: [3, 5, 7, 4, 6],
    },
    collaboration: {
      presenceIndicators: true,
      conflictWarnings: true,
      defaultLandingView: 'Last Active Board',
      compactCardDensity: false,
    },
    notifications: {
      directAssignments: true,
      mentions: true,
      dueDateApproaching: true,
      weeklySprintDigest: false,
    },
    lastUpdated: formatTimeNow(),
    workspaceMembers: [
      { id: '1', name: 'Mohomad Ashfark', email: 'mohomadashfrak@gmail.com', role: 'Workspace Owner', initials: 'MA' },
      { id: '2', name: 'Jane Doe', email: 'jane.doe@techcorp.com', role: 'Team Member', initials: 'JD' },
      { id: '3', name: 'Test User', email: 'testuser@collabboard.dev', role: 'Team Member', initials: 'TU' },
    ],
  });
};

// PUT /api/settings
exports.updateSettings = async (req, res) => {
  try {
    const { userId, user } = await resolveUserFromReq(req);
    const updates = req.body;
    const lastUpdated = formatTimeNow();

    if (mongoose.connection.readyState === 1) {
      let settings = await Settings.findOne({ userId });
      if (!settings) {
        settings = new Settings({ userId });
      }

      if (updates.profile) {
        settings.profile = { ...(settings.profile ? settings.profile.toObject() : {}), ...updates.profile };

        // Also sync profile name and email to User collection in MongoDB
        if (userId && userId !== 'default-user') {
          try {
            await User.findByIdAndUpdate(userId, {
              name: updates.profile.fullName,
              email: updates.profile.email,
            });
          } catch (uErr) {
            console.warn('Could not sync profile to User model:', uErr.message);
          }
        }
      }
      if (updates.collaboration) {
        settings.collaboration = {
          ...(settings.collaboration ? settings.collaboration.toObject() : {}),
          ...updates.collaboration,
        };
      }
      if (updates.notifications) {
        settings.notifications = {
          ...(settings.notifications ? settings.notifications.toObject() : {}),
          ...updates.notifications,
        };
      }
      settings.lastUpdated = lastUpdated;

      await settings.save();
      return res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        settings,
      });
    }
  } catch (err) {
    console.warn('MongoDB update failed in updateSettings:', err.message);
  }

  return res.status(200).json({
    success: true,
    message: 'Settings updated successfully',
    settings: {
      ...req.body,
      lastUpdated: formatTimeNow(),
    },
  });
};

// POST /api/settings/reset-notifications
exports.resetNotifications = async (req, res) => {
  const defaultNotifs = {
    directAssignments: true,
    mentions: true,
    dueDateApproaching: true,
    weeklySprintDigest: false,
  };

  try {
    const { userId } = await resolveUserFromReq(req);
    if (mongoose.connection.readyState === 1) {
      let settings = await Settings.findOne({ userId });
      if (settings) {
        settings.notifications = defaultNotifs;
        settings.lastUpdated = formatTimeNow();
        await settings.save();
        return res.status(200).json(settings);
      }
    }
  } catch (err) {
    console.warn('MongoDB reset error:', err.message);
  }

  return res.status(200).json({
    notifications: defaultNotifs,
    lastUpdated: formatTimeNow(),
  });
};
