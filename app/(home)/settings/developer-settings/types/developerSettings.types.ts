export type PageRole =
  | "ADMIN"
  | "STUDENT"
  | "TRAINER"
  | "ORGANIZATION"
  | "EXTERNALEXAMINEE";

export interface SectionPage {
  id: number;
  pageName: string;
  pageUrl: string;
  position: number;
  status: boolean;
  sectionId: number;
  sectionName: string;
  roles: PageRole[];
}

export interface Section {
  id: number;
  name: string;
  position: number;
  status: boolean;
  pages: SectionPage[];
}

export interface SectionsListResponse {
  data: Section[];
  count: number;
  message: string;
  status: string;
}

export interface SingleSectionResponse {
  data: Section;
  message: string;
  status: string;
}

export interface SinglePageResponse {
  data: SectionPage;
  message: string;
  status: string;
}
