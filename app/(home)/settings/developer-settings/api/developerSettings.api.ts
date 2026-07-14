export const CREATESECTIONPAGE = () => "page-access";

export const ALLSECTIONS = () => "page-access";

export const SINGLESECTION = (id: number | string) => `page-access/${id}`;

export const UPDATESECTION = (id: number | string) =>
  `page-access/section/${id}`;

export const DELETESECTION = (id: number | string) =>
  `page-access/section/${id}`;

export const UPDATESECTIONORDER = () => "page-access/section/order";

export const SECTIONSTATUS = (id: number | string) =>
  `page-access/section/status/${id}`;

export const ADDPAGE = () => "page";

export const SINGLEPAGE = (id: number | string) => `page/${id}`;

export const UPDATEPAGE = (id: number | string) => `page/${id}`;

export const DELETEPAGE = (id: number | string) => `page/${id}`;

// The id here scopes reordering to the pages within one section (mirrors
// section/order's array-of-{id,position} body, just applied per-section).
export const UPDATEPAGEORDER = (sectionId: number | string) =>
  `page/order/${sectionId}`;

export const PAGESTATUS = (id: number | string) => `page/status/${id}`;
