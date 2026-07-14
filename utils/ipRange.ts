// utils/ipRange.ts

/**
 * Convert IP string to numeric value
 */
function ipToNumber(ip: string): number {
  const parts = ip.split(".").map(Number);

  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    throw new Error("Invalid IP address format");
  }

  return parts[0] * 256 ** 3 + parts[1] * 256 ** 2 + parts[2] * 256 + parts[3];
}

/**
 * Convert numeric value back to IP string
 */
function numberToIp(num: number): string {
  return [
    Math.floor(num / 256 ** 3) % 256,
    Math.floor(num / 256 ** 2) % 256,
    Math.floor(num / 256) % 256,
    num % 256,
  ].join(".");
}

/**
 * Generate list of IPs between start and end (inclusive)
 */
export function generateIpRange(startIp: string, endIp: string): string[] {
  const start = ipToNumber(startIp);
  const end = ipToNumber(endIp);

  if (start > end) {
    throw new Error("Start IP must be less than or equal to End IP");
  }

  const result: string[] = [];

  for (let i = start; i <= end; i++) {
    result.push(numberToIp(i));
  }

  return result;
}
