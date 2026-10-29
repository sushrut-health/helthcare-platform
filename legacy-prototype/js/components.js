/**
 * Shared UI component templates and helpers
 */
const Components = {
  // Navigation elements
  renderPublicNavbar(activePage = '') {
    return `
      <div class="prototype-disclaimer">
        <span>⚠️ <strong>Visual Frontend Prototype</strong> — No real medical records or appointments are processed.</span>
      </div>
      <header class="public-navbar">
        <div class="nav-container">
          <a href="home.html" class="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>
            Sushrut Health
          </a>
          <nav class="nav-links" id="navMenu">
            <a href="home.html" class="${activePage === 'home' ? 'active' : ''}">Home</a>
            <a href="find-doctors.html" class="${activePage === 'find-doctors' ? 'active' : ''}">Find Doctors</a>
            <a href="find-labs.html" class="${activePage === 'find-labs' ? 'active' : ''}">Find Laboratories</a>
            <a href="home.html#how-it-works">How It Works</a>
          </nav>
          <div class="nav-auth">
            <a href="../auth/login.html" class="btn btn-outline btn-sm">Log In</a>
            <a href="../auth/register-patient.html" class="btn btn-primary btn-sm">Sign Up</a>
            <button class="mobile-menu-toggle" id="menuToggle" aria-label="Toggle navigation">☰</button>
          </div>
        </div>
      </header>
    `;
  },

  renderPublicFooter() {
    return `
      <footer class="public-footer">
        <div class="footer-container">
          <div>
            <div class="brand-logo" style="margin-bottom: 12px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>
              Sushrut Health
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">
              Modern, interconnected digital healthcare platform empowering patients, doctors, and diagnostic laboratories.
            </p>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 14px; font-weight: 600;">For Patients</h4>
            <ul style="display:flex; flex-direction:column; gap:8px; font-size: 0.9rem; color: var(--text-muted);">
              <li><a href="find-doctors.html">Find Doctors</a></li>
              <li><a href="find-labs.html">Book Diagnostic Tests</a></li>
              <li><a href="../auth/register-patient.html">Patient Sign Up</a></li>
              <li><a href="../patient/dashboard.html">Patient Portal</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 14px; font-weight: 600;">For Providers</h4>
            <ul style="display:flex; flex-direction:column; gap:8px; font-size: 0.9rem; color: var(--text-muted);">
              <li><a href="../auth/register-doctor.html">Doctor Registration</a></li>
              <li><a href="../auth/register-lab.html">Laboratory Registration</a></li>
              <li><a href="../doctor/dashboard.html">Doctor Portal</a></li>
              <li><a href="../laboratory/dashboard.html">Laboratory Portal</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 14px; font-weight: 600;">Governance</h4>
            <ul style="display:flex; flex-direction:column; gap:8px; font-size: 0.9rem; color: var(--text-muted);">
              <li><a href="../admin/dashboard.html">Admin Oversight</a></li>
              <li><a href="../admin/settings-audit-logs.html">Audit Logs</a></li>
              <li><a href="#" onclick="alert('Prototype Note: Patient Privacy Policy demonstration.'); return false;">Privacy Policy</a></li>
              <li><a href="#" onclick="alert('Prototype Note: Terms of Service demonstration.'); return false;">Terms of Use</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 14px; font-weight: 600;">Prototype Settings</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">Reset demonstration LocalStorage state to initial dataset:</p>
            <button class="btn btn-outline btn-sm" onclick="Storage.resetStore(); alert('Demonstration data restored!'); location.reload();">Reset Demo Data</button>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2026 Sushrut Health Platform (Visual UI Prototype). All rights reserved.</span>
          <span>Designed with Vanilla HTML5, CSS3 & JavaScript.</span>
        </div>
      </footer>
    `;
  },

  renderDashboardSidebar(role, activePage = '') {
    const menus = {
      patient: [
        { name: "Dashboard", href: "dashboard.html", id: "dashboard", icon: "📊" },
        { name: "Find Doctors", href: "find-doctors.html", id: "find-doctors", icon: "🩺" },
        { name: "My Appointments", href: "my-appointments.html", id: "my-appointments", icon: "📅" },
        { name: "Find Lab Tests", href: "book-lab-tests.html", id: "book-lab-tests", icon: "🧪" },
        { name: "Medical Records", href: "medical-records.html", id: "medical-records", icon: "📁" },
        { name: "Prescriptions", href: "prescriptions.html", id: "prescriptions", icon: "💊" },
        { name: "Lab Reports", href: "lab-reports.html", id: "lab-reports", icon: "📋" },
        { name: "Profile & Settings", href: "profile-settings.html", id: "profile-settings", icon: "⚙️" },
      ],
      doctor: [
        { name: "Dashboard", href: "dashboard.html", id: "dashboard", icon: "📊" },
        { name: "Today's Appointments", href: "todays-appointments.html", id: "todays-appointments", icon: "📋" },
        { name: "Appointment Calendar", href: "appointment-calendar.html", id: "appointment-calendar", icon: "📅" },
        { name: "Manage Availability", href: "manage-availability.html", id: "manage-availability", icon: "⏰" },
        { name: "Access Requests", href: "access-requests.html", id: "access-requests", icon: "🔒" },
        { name: "Profile & Settings", href: "profile-settings.html", id: "profile-settings", icon: "⚙️" },
      ],
      laboratory: [
        { name: "Dashboard", href: "dashboard.html", id: "dashboard", icon: "📊" },
        { name: "Laboratory Profile", href: "profile.html", id: "profile", icon: "🏥" },
        { name: "Tests & Services", href: "tests-services.html", id: "tests-services", icon: "🧪" },
        { name: "Test Bookings", href: "bookings.html", id: "bookings", icon: "📑" },
        { name: "Upload Reports", href: "upload-report.html", id: "upload-report", icon: "📤" },
        { name: "Report History", href: "report-history.html", id: "report-history", icon: "📁" },
        { name: "Settings", href: "settings.html", id: "settings", icon: "⚙️" },
      ],
      admin: [
        { name: "Dashboard", href: "dashboard.html", id: "dashboard", icon: "📊" },
        { name: "Doctor Approvals", href: "doctor-approvals.html", id: "doctor-approvals", icon: "👨‍⚕️" },
        { name: "Lab Approvals", href: "lab-approvals.html", id: "lab-approvals", icon: "🔬" },
        { name: "Patients", href: "patients.html", id: "patients", icon: "👥" },
        { name: "Doctors", href: "doctors.html", id: "doctors", icon: "🩺" },
        { name: "Laboratories", href: "laboratories.html", id: "laboratories", icon: "🏥" },
        { name: "Appointments", href: "appointments.html", id: "appointments", icon: "📅" },
        { name: "Settings & Audit Logs", href: "settings-audit-logs.html", id: "settings-audit-logs", icon: "📜" },
      ]
    };

    const roleBadges = {
      patient: '<span class="badge badge-primary">Patient</span>',
      doctor: '<span class="badge badge-info">Doctor</span>',
      laboratory: '<span class="badge badge-warning">Laboratory</span>',
      admin: '<span class="badge badge-error">Administrator</span>'
    };

    const items = menus[role] || [];
    const listHtml = items.map(item => `
      <a href="${item.href}" class="sidebar-link ${activePage === item.id ? 'active' : ''}">
        <span>${item.icon}</span>
        <span>${item.name}</span>
      </a>
    `).join('');

    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <a href="../public/home.html" class="brand-logo" style="font-size: 1.15rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>
            Sushrut
          </a>
          ${roleBadges[role] || ''}
        </div>
        <nav class="sidebar-menu">
          ${listHtml}
        </nav>
        <div class="sidebar-footer">
          <a href="../auth/login.html" class="sidebar-link" style="color: var(--error);">
            <span>🚪</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>
    `;
  },

  renderDashboardHeader(role, title, breadcrumbs = []) {
    const userNames = {
      patient: 'Aarav Patel',
      doctor: 'Dr. Ananya Sharma',
      laboratory: 'ThyroCare Lab Desk',
      admin: 'Administrator (ADM01)'
    };
    const initials = {
      patient: 'AP',
      doctor: 'AS',
      laboratory: 'TL',
      admin: 'AD'
    };

    const bcHtml = breadcrumbs.length > 0 ? `
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">
        ${breadcrumbs.map((b, i) => i === breadcrumbs.length - 1 ? `<span>${b.label}</span>` : `<a href="${b.href}" style="color: var(--primary);">${b.label}</a> / `).join('')}
      </div>
    ` : '';

    return `
      <header class="dashboard-topbar">
        <div style="display: flex; align-items: center; gap: 14px;">
          <button class="mobile-menu-toggle" id="sidebarToggle" aria-label="Toggle Menu" style="display: inline-block;">☰</button>
          <div>
            ${bcHtml}
            <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">${title}</h2>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <a href="../public/home.html" class="btn btn-outline btn-sm" title="View Public Portal">Public Site ↗</a>
          <button class="btn btn-light btn-sm" onclick="alert('Demonstration: No new alerts.');" title="Notifications">🔔</button>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="avatar">${initials[role] || 'US'}</div>
            <div style="line-height: 1.2; display: none; @media(min-width: 768px){display: block;}">
              <div style="font-size: 0.875rem; font-weight: 600;">${userNames[role] || 'User'}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: capitalize;">${role}</div>
            </div>
          </div>
        </div>
      </header>
    `;
  }
};

window.Components = Components;
