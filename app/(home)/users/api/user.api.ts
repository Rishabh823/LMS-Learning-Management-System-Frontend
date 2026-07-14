import { withPaginationQuery } from "@/utils/pagination";

// Admin: pass the org id from SelectedOrgProvider (TopNav dropdown).
export const ALLUSERORGWISE = (
  id: string | number,
  pageNumber: number,
  pageSize: number,
) => withPaginationQuery(`/user/org/${id}`, pageNumber, pageSize);

// Organization login: no id needed, backend scopes to the caller's own org.
export const ALLUSERONLY = (pageNumber: number, pageSize: number) =>
  withPaginationQuery("/user/students/list", pageNumber, pageSize);

export const USERDETAILS = (userId: string) => `/user/details/${userId}`;

export const UPDATEUSER = () => "/user/update";

export const USERSTATUS = (userId: string, status: boolean) =>
  `user/toggleStatus/${userId}?activate=${status}`;

export const PROFILEPIC = (userId: string) =>
  `user/updateProfilePic?userId=${userId}`;

export const REGISTERUSER = (formId: number | string) =>
  `register/${formId}`;
