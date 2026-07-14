export interface InstructorProfile {
  userProfileId: number;
  dob: string | null;
  designation: string | null;
  degreeName: string;
  passingYear: string;
  percentage: string;
  totalExprience: number;
}

export interface Instructor {
  userId: string;
  emailId: string;
  name: string;
  gender: string;
  contactNo: string;
  profilePic: string | null;
  status: boolean;
  createdBy: string;
  instructType: string;
  usersProfile: InstructorProfile;
}

export interface TrainersListResponse {
  totalItems: number;
  data: Instructor[];
  totalPages: number;
  message: string;
  currentPage: number;
  status: string;
}

// Shape of "/course/" is not confirmed from a real API response yet, so we
// stay defensive and only rely on courseId + a best-guess label field.
export interface Course {
  courseId: number | string;
  courseName?: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
}
