export interface Group {
  groupId: number | string;
  groupName: string;
  groupDescription?: string | null;
  organizationId?: number | string;
  status: boolean;
  createdDate?: string;
  modifiedDate?: string;
  // Attached client-side when flattening the admin's org-list-with-groups
  // response, so the table can show which org a group belongs to.
  organizationName?: string;
  [key: string]: unknown;
}

export interface GroupsListResponse {
  totalItems: number;
  data: Group[];
  totalPages: number;
  message: string;
  currentPage: number;
  status: string;
}

// Shape of "/org/filterByStatus?type=active" — a page of organizations, each
// carrying its own nested groups[].
export interface OrgWithGroups {
  organizationId: number | string;
  fullName: string;
  groups: Group[];
  [key: string]: unknown;
}

export interface OrgsWithGroupsResponse {
  totalItems: number;
  data: OrgWithGroups[];
  totalPages: number;
  message: string;
  currentPage: number;
  status: string;
}

export interface GroupUser {
  userId: string;
  name: string;
  emailId?: string;
  [key: string]: unknown;
}

export interface GroupUsersListResponse {
  totalItems: number;
  data: GroupUser[];
  totalPages: number;
  message: string;
  currentPage: number;
  status: string;
}

// "/course/" response shape wasn't confirmed, kept loose defensively
// (mirrors the same assumption made in the instructor/organization features).
export interface Course {
  courseId: number | string;
  courseName?: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
}
