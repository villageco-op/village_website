import { type Invite, OrgRole } from '@/lib/api/generated/models';

export const BASE_MOCK_INVITE: Invite = {
  id: 'invite_1',
  email: 'pending.teammate@example.com',
  orgId: 'org_123',
  code: 'abc789',
  role: OrgRole.member,
  status: 'pending',
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
  createdAt: new Date().toISOString(),
};
