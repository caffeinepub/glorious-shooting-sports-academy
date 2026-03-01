# Specification

## Summary
**Goal:** Add a `grantAdminRole` backend function restricted to owner-role users, and a "Manage Admins" UI section in the Admin Dashboard so that any principal (including the one associated with sairamdevil2515@gmail.com) can be elevated to admin with full privileges.

**Planned changes:**
- Add a `grantAdminRole(principal: Principal)` backend function in `backend/main.mo`, callable only by owner-role users, that persists the granted admin role in stable storage.
- Add an `addAdminByPrincipal(principal: Principal)` backend function callable only by the owner role.
- Ensure granted admin principals can perform all admin-privileged operations: add scores, delete scores, and access the admin dashboard.
- Add a "Manage Admins" section to `frontend/src/pages/AdminDashboard.tsx`, visible only to owner-role users, with a principal ID text input and a "Grant Admin Role" button.
- Display success or error feedback after the grant operation, and clear the input on success.
- Include a helper note in the UI explaining that the principal ID must be obtained from the user's Internet Identity login session.

**User-visible outcome:** Owner-role users can open the Admin Dashboard, enter any principal ID, and grant that principal full admin privileges. The new admin can then add/delete scores and access the admin dashboard without any additional configuration.
