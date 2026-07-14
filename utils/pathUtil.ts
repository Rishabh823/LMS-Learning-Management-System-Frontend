// /app/lib/pathUtil.ts

export interface Crumb {
  label: string;
  href: string;
  key: string;
  isId?: boolean;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Returns true if the segment is an ID — either numeric (e.g. "12", "45") or
 * a UUID (e.g. "d7d29ab9-84d3-421d-bfb0-947efe783774").
 */
export const isIdSegment = (seg: string): boolean =>
  /^\d+$/.test(seg) || UUID_PATTERN.test(seg);

/**
 * Convert a URL pathname ("/dashboard/users/123/edit") into
 * breadcrumb segments with human-friendly labels.
 */
export const pathToBreadcrumbs = (pathname: string): Crumb[] => {
  if (!pathname || pathname === "/") {
    return [{ label: "Home", href: "/", key: "home" }];
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];

  let path = "";

  for (const seg of segments) {
    path += `/${seg}`;

    const isId = isIdSegment(seg);

    // Convert "user-profile" → "User Profile", or show "Details" for IDs
    const label = isId
      ? "Details"
      : seg.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

    crumbs.push({
      label,
      href: path,
      key: isId ? "__id__" : seg.toLowerCase(),
      isId,
    });
  }

  return crumbs;
};
