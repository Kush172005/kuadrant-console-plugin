/**
 * Helpers for extracting resource info from an OpenShift Console URL.
 *
 * Console resource paths look like:
 *   /k8s/ns/<namespace>/<group>~v<version>~<kind>/<name>/<subpath>
 *
 * For example:
 *   /k8s/ns/toystore-1/gateway.networking.k8s.io~v1~HTTPRoute/toystore/policies
 *
 * Versions can be v1, v1alpha1, v2beta3, etc.
 */

const GVK_SEGMENT_RE = /^.+~v[^~]+~.+$/;

/**
 * Extracts the resource name (segment after the GVK).
 * For the example above, returns "toystore".
 */
const extractResourceNameFromURL = (pathname: string): string | null => {
  const pathSegments = pathname.split('/');
  const resourceIndex = pathSegments.findIndex((segment) => GVK_SEGMENT_RE.test(segment));

  if (resourceIndex !== -1 && resourceIndex + 1 < pathSegments.length) {
    return pathSegments[resourceIndex + 1];
  }

  return null;
};

/**
 * Extracts the resource kind (the third part of the GVK segment).
 * For the example above, returns "HTTPRoute".
 */
export const extractKindFromURL = (pathname: string): string | null => {
  const segment = pathname.split('/').find((s) => GVK_SEGMENT_RE.test(s));
  if (!segment) return null;
  const parts = segment.split('~');
  return parts[2] ?? null;
};

/**
 * Extracts the namespace (segment after `/ns/`).
 * For the example above, returns "toystore-1".
 */
export const extractNamespaceFromURL = (pathname: string): string | null => {
  const segments = pathname.split('/');
  const nsIndex = segments.findIndex((s) => s === 'ns');
  if (nsIndex === -1 || nsIndex + 1 >= segments.length) return null;
  return segments[nsIndex + 1] || null;
};

export default extractResourceNameFromURL;
