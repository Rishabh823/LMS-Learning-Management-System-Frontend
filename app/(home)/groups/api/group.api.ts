import { withPaginationQuery } from "@/utils/pagination";

export const CREATEGROUP = () => "/org/group";

export const UPDATEGROUP = () => "org/updateGroup";

// Groups are always fetched by org id — for an ORGANIZATION login that's the
// org id captured at login (via SelectedOrgProvider); for ADMIN it's whatever
// org is currently picked in the TopNav org dropdown (same shared context).
export const GROUPLISTBYORG = (orgId: string | number) =>
  `org/groupList/${orgId}`;

// Admins see every organization's groups at once (this response nests each
// org's groups[] plus the org's own details, which is how the table can show
// which organization a group belongs to).
export const ALLORGSWITHGROUPS = () => "/org/filterByStatus?type=active";

export const GROUPSTATUS = (groupId: string | number, status: boolean) =>
  `org/group/toggleStatus/${groupId}?activate=${status ? "true" : "false"}`;

export const ASSIGNCOURSETOGROUP = () => "course/group/assignCourses";

export const ASSIGNGROUPTOUSER = () => "user/assignGroup";

export const USERSBYORG = (orgId: string | number) => `user/org/${orgId}`;

export const ALLCOURSES = () => "/course/";

export const GROUPUSERS = (
  groupId: string | number,
  pageNumber: number,
  pageSize: number,
) => withPaginationQuery(`user/group/${groupId}`, pageNumber, pageSize);
