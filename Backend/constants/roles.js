export const ROLES = Object.freeze({
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin',
});

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.VIEWER]: ['dashboard:read'],
  [ROLES.ANALYST]: ['dashboard:read', 'records:read'],
  [ROLES.ADMIN]: ['dashboard:read', 'records:read', 'records:write', 'records:delete', 'users:manage'],
});

