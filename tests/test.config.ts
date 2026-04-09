/**
 * Test configuration for different projects
 * Maps project codes to their test environment URLs
 */

export const projectUrls: Record<string, string> = {
  'UFA': 'https://akbps-ufa-sandbox-headless.onakumina.com',
  'LAC': 'https://lacourts-dev.sharepoint.com',
  'JMSMUC': 'https://jmsmuckers-dev.sharepoint.com',
  'WCB': 'https://wcb-dev.sharepoint.com',
  'BCRS': 'https://ballcorp-dev.sharepoint.com',
  'POM': 'https://pomerleau-dev.sharepoint.com'
};

export function getProjectUrl(projectCode: string): string {
  return projectUrls[projectCode] || 'https://example.com';
}
