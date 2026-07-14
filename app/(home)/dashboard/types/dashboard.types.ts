export interface Organization {
  organizationId: string;
  fullName: string;
}

export interface TotalOrganizationsResponse {
  data: number;
  count: number;
  message: string;
  status: string;
}

export interface TotalTrainersResponse {
  data: number;
  count: number;
  message: string;
  status: string;
}

export interface TotalUsersData {
  nonAcceptedUsers: number;
  totalUsers: number;
  acceptedUsers: number;
}

export interface TotalUsersResponse {
  data: TotalUsersData;
  count: number;
  message: string;
  status: string;
}

export interface OrgGroupCount {
  groupId: number;
  groupName: string;
  totalTrainers: number;
  totalStudents: number;
}

export interface OrgGroupsCountResponse {
  data: OrgGroupCount[];
  count: number;
  message: string;
  status: string;
}

export interface OrgStudentsCountData {
  activeStudents: number;
  inactiveStudents: number;
}

export interface OrgStudentsCountResponse {
  data: OrgStudentsCountData;
  count: number;
  message: string;
  status: string;
}

export interface OrgTrainersCountData {
  activeTrainers: number;
  inactiveTrainers: number;
}

export interface OrgTrainersCountResponse {
  data: OrgTrainersCountData;
  count: number;
  message: string;
  status: string;
}

export interface OrgCoursesCountData {
  totalCourses: number;
  ongoingCourses: number;
  plannedCourses: number;
  completedCourses: number;
}

export interface OrgCoursesCountResponse {
  data: OrgCoursesCountData;
  count: number;
  message: string;
  status: string;
}

export interface OrgExamsCountData {
  totalExams: number;
  plannedExams: number;
  ongoingExams: number;
  completedExams: number;
}

export interface OrgExamsCountResponse {
  data: OrgExamsCountData;
  count: number;
  message: string;
  status: string;
}

export interface OrgQuizzesCountData {
  totalQuizzes: number;
  totalSubmissions: number;
}

export interface OrgQuizzesCountResponse {
  data: OrgQuizzesCountData;
  count: number;
  message: string;
  status: string;
}

export interface OrgLiveTrainingsCountData {
  totalTrainings: number;
  plannedTrainings: number;
  inProgressTrainings: number;
  completedTrainings: number;
}

export interface OrgLiveTrainingsCountResponse {
  data: OrgLiveTrainingsCountData;
  count: number;
  message: string;
  status: string;
}
