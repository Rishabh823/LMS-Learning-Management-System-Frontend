import { useApiQuery } from "@/services/useApiQuery";
import { useAuthToken } from "@/utils/useAuthToken";

export type UserRole =
  | "ADMIN"
  | "STUDENT"
  | "TRAINER"
  | "ORGANIZATION"
  | "EXTERNALEXAMINEE";

interface Page {
  pageId: number;
  pageName: string;
  pageUrl: string;
  pagePosition: number;
  permissions?: any[];
}

interface Module {
  moduleId: number;
  moduleName: string;
  modulePosition: number;
  iconName?: string | null;
  pages: Page[];
}

interface Sidebar {
  userId: string;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  email: string;
  profilePic?: string | null;
  role: UserRole;
  modules: Module[];
}

interface SidebarResponse {
  data: Sidebar;
  message: string;
  status: string;
}

const useSidebar = () => {
  const token = useAuthToken();

  const { data, isLoading, isError, refetch } = useApiQuery<SidebarResponse>({
    endpoint: "sidebar",
    enabled: !!token,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export default useSidebar;
