import { withPaginationQuery } from "@/utils/pagination";

export const ORG = (
  status: string | undefined,
  pageNumber: number,
  pageSize: number,
) =>
  withPaginationQuery(
    `/org/filterByStatus?type=${status ?? ""}`,
    pageNumber,
    pageSize,
  );

export const ORGGROUP = (
  id: string | number,
  pageNumber: number,
  pageSize: number,
) => withPaginationQuery(`org/groupList/${id}`, pageNumber, pageSize);

export const UPDATEGROUPSTATUS = (id: string | number, status: boolean) =>
  `org/group/toggleStatus/${id}?activate=${status}`;

export const UPDATEGROUP = () => "org/group";

export const ADDORG = () => "/org";

export const UPDATEORG = () => "org/updateOrg";

export const ORGSTATUS = (orgid: string | number, status: boolean) =>
  `org/toggleStatus/${orgid}?activate=${status ? "true" : "false"}`;

export const COURSE = () => "/course/";

export const TRAINER = (pageNumber: number, pageSize: number) =>
  withPaginationQuery("/user/allTrainers", pageNumber, pageSize);

export const ASSIGNCOURSETOORG = () => "orgCourse/assignCourses";

export const ASSIGNTRAINERTOORG = () => "orgtrainers/assignOrg";
