export const ORG_LIST_ENDPOINT = "/org/public";

export const TOTAL_ORGANIZATIONS_ENDPOINT = "/dashboard/totalOrganization";
export const TOTAL_TRAINERS_ENDPOINT = "/dashboard/totalTrainer";
export const TOTAL_USERS_ENDPOINT = "/dashboard/totalUsers";

const orgBase = (orgId: string | number) =>
  `/admin-dashboard/organizations/${orgId}`;

export const orgGroupsCountEndpoint = (orgId: string | number) =>
  `${orgBase(orgId)}/groups/count`;

export const orgStudentsCountEndpoint = (orgId: string | number) =>
  `${orgBase(orgId)}/students/count`;

export const orgTrainersCountEndpoint = (orgId: string | number) =>
  `${orgBase(orgId)}/trainers/count`;

export const orgCoursesCountEndpoint = (orgId: string | number) =>
  `${orgBase(orgId)}/courses/count`;

export const orgExamsCountEndpoint = (orgId: string | number) =>
  `${orgBase(orgId)}/exams/count`;

export const orgQuizzesCountEndpoint = (orgId: string | number) =>
  `${orgBase(orgId)}/quizzes/count`;

export const orgLiveTrainingsCountEndpoint = (orgId: string | number) =>
  `${orgBase(orgId)}/live-trainings/count`;
