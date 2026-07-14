// Field names for fullName/organizationId are confirmed (used already by
// SelectedOrgProvider's org picker). The rest of the list-row shape is
// inferred from the add/update payload contracts since no sample list
// response was provided — kept loose with an index signature to stay safe.
export interface Organization {
  organizationId: number | string;
  fullName: string;
  ownersName: string;
  address: string;
  emailId: string;
  emailIdAlternate: string | null;
  state: string;
  city: string;
  zipcode: string;
  contact: string;
  contactAlternate: string | null;
  country: string;
  aboutOrganization: string;
  logo?: string | null;
  status?: boolean | string;
  [key: string]: unknown;
}

export interface OrganizationsListResponse {
  totalItems: number;
  data: Organization[];
  totalPages: number;
  message: string;
  currentPage: number;
  status: string;
}

// Group payload contract wasn't provided beyond the endpoints themselves, so
// this is a best-guess minimal shape (groupId + groupName + status).
export interface OrgGroup {
  groupId: number | string;
  groupName: string;
  status: boolean;
  [key: string]: unknown;
}

export interface OrgGroupsListResponse {
  totalItems: number;
  data: OrgGroup[];
  totalPages: number;
  message: string;
  currentPage: number;
  status: string;
}

// "/course/" response shape wasn't confirmed, kept loose defensively.
export interface Course {
  courseId: number | string;
  courseName?: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
}

export interface Trainer {
  userId: string;
  name: string;
  [key: string]: unknown;
}

export interface TrainersListResponse {
  totalItems: number;
  data: Trainer[];
  totalPages: number;
  message: string;
  currentPage: number;
  status: string;
}
