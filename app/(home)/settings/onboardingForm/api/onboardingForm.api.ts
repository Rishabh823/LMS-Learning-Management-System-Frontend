export const CREATEFORM = () => "forms";

export const UPDATEFORM = () => "forms";

export const GETMYFORM = () => "forms/me";

export const GETFORMBYORG = (orgId: string | number) =>
  `forms/organization/${orgId}`;

// No body/query param was shown for this in Postman — publishing appears to
// act on the current user's own org-scoped form (mirrors the "me" endpoint).
export const PUBLISHFORM = () => "forms/publish";

export const UNPUBLISHFORM = () => "forms/unpublish";

export const UPLOADFIELDFILE = () => "forms/field/upload";

export const GETFIELDFILE = (fieldId: number | string) =>
  `forms/field/${fieldId}/file`;
