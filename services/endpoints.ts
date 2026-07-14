export const endpoints = {
  auth: "/login",
  getUser: "/user/get",
  createUser: "/user/create",
  updateUser: "/user/update",
  deleteUser: "/user/delete",
  listUsers: "/user/list",

  setting: {
    module: "/modules",
    allModule: "/modules/all",
    page: "/pages",
    allPage: "/pages/all",
  },
};

export const MARKASREAD = (id: number | string) => {
  return `notifications/${id}/read`;
};

export const MARKALLREAD = () => {
  return "notifications/all/read";
};
