export interface UserProfile {
  userProfileId: number;
  dob: string | null;
  designation: string | null;
  degreeName: string | null;
  passingYear: string | null;
  percentage: string | null;
  totalExprience: number | null;
}

export interface AppUser {
  userId: string;
  emailId: string;
  name: string;
  gender: string | null;
  contactNo: string;
  profilePic: string | null;
  status: boolean;
  createdBy: string;
  instructType: string | null;
  usersProfile: UserProfile | null;
}

export interface UsersListResponse {
  totalItems: number;
  data: AppUser[];
  totalPages: number;
  message: string;
  currentPage: number;
  status: string;
}

export interface OnboardingField {
  // Not present in the "/user/details/{id}" response yet — only known once
  // the backend adds it there. Update submissions skip any field missing one.
  fieldId?: number;
  label: string;
  type: string;
  required: boolean;
  value: string;
}

export interface OnboardingSection {
  sectionTitle: string;
  fields: OnboardingField[];
}

export interface OnboardingData {
  submitted: boolean;
  submittedDate: string | null;
  sections: OnboardingSection[];
}

export interface UserDetail {
  userId: string;
  emailId: string;
  name: string;
  gender: string | null;
  role: string;
  contactNo: string;
  status: boolean;
  createdBy: string;
  instructType: string | null;
  profilePic: string | null;
  onboarding: OnboardingData | null;
  organization: {
    organizationId: number | string;
    fullName: string;
  } | null;
}

export interface UserDetailResponse {
  data: UserDetail;
  count: number;
  message: string;
  status: string;
}
