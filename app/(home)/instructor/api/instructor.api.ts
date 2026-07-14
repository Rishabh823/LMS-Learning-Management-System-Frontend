import { withPaginationQuery } from "@/utils/pagination";

export const TRAINERORG = (
  orgId: string | number,
  pageNumber: number,
  pageSize: number,
) => withPaginationQuery(`org/trainers/${orgId}`, pageNumber, pageSize);

export const TRAINER = (pageNumber: number, pageSize: number) =>
  withPaginationQuery("user/allTrainers", pageNumber, pageSize);

export const UPDATETRAINER = (id: string) => `user/updateTrainer/${id}`;

export const UPDATEUSERSTATUS = (userId: string, status: boolean) =>
  `user/toggleStatus/${userId}?activate=${status}`;

export const ASSIGNCOURSETRAINER = () => "user/trainer/assignCourses";

export const SIGNUPTRAINER = () => "signup/trainer";

export const ALLCOURSES = () => "course/";

export const head = [
  { id: 1, name: "" },
  { id: 2, name: "Name" },
  { id: 3, name: "Email" },
  { id: 4, name: "Phone Number" },
  { id: 5, name: "Gender" },
  { id: 6, name: "Degree Name" },
  { id: 7, name: "Percentage" },
  { id: 8, name: "Year Of Passing" },
  { id: 9, name: "Experience" },
  { id: 10, name: "Status" },
];
