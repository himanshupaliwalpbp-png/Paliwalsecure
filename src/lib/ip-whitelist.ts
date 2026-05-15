// ── IP Whitelisting for Admin Routes ──────────────────────────────────────────
// Reads ADMIN_ALLOWED_IPS from env (comma-separated)
// If not set or empty: allow all IPs (development mode)
// If set: only allow IPs in the list

const ALLOWED_IPS = process.env.ADMIN_ALLOWED_IPS?.split(',')
  .map(ip => ip.trim())
  .filter(ip => ip.length > 0) ?? [];

/**
 * Check if a given IP is allowed to access admin routes.
 * If ADMIN_ALLOWED_IPS is not configured, all IPs are allowed (dev mode).
 */
export function isIpAllowed(ip: string): boolean {
  // No restriction configured — allow all
  if (ALLOWED_IPS.length === 0) return true;

  // Exact match
  if (ALLOWED_IPS.includes(ip)) return true;

  // CIDR support for /24 subnets (simple check)
  for (const allowed of ALLOWED_IPS) {
    if (allowed.includes('/')) {
      const [network, prefixLen] = allowed.split('/');
      const prefix = parseInt(prefixLen, 10);
      if (isIpInCidr(ip, network, prefix)) return true;
    }
  }

  return false;
}

/**
 * Simple CIDR match (IPv4 only).
 */
function isIpInCidr(ip: string, network: string, prefix: number): boolean {
  const ipParts = ip.split('.').map(Number);
  const netParts = network.split('.').map(Number);

  if (ipParts.length !== 4 || netParts.length !== 4) return false;
  if (ipParts.some(isNaN) || netParts.some(isNaN)) return false;

  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const netNum = (netParts[0] << 24) | (netParts[1] << 16) | (netParts[2] << 8) | netParts[3];
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;

  return (ipNum & mask) === (netNum & mask);
}

/**
 * Get the list of configured allowed IPs (for display purposes).
 */
export function getConfiguredIps(): string[] {
  return [...ALLOWED_IPS];
}
