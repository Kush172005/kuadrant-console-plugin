import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom-v5-compat';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';

/**
 * Custom hook for handling namespace-aware routing in Kuadrant pages
 *
 * Provides a consistent pattern for:
 * - Syncing URL namespace parameter with console's active namespace
 * - Handling namespace changes from the NamespaceBar
 * - Navigating between base and namespace-scoped routes
 * - Optionally preserving sub-paths (like tabs) when changing namespaces
 *
 * @param basePath - The base path for the page (e.g., '/apiproducts', '/policies')
 * @param getCurrentSubPath - Optional callback to extract current sub-path (e.g., active tab)
 * @returns An object with handleNamespaceChange function and activeNamespace
 *
 * @example
 * ```tsx
 * // Simple usage without tab preservation
 * const { handleNamespaceChange, activeNamespace } = useKuadrantNamespaceChange('/apiproducts');
 *
 * // With tab preservation
 * const { handleNamespaceChange, activeNamespace } = useKuadrantNamespaceChange('/policies', () => {
 *   // Extract current tab from URL
 *   return currentTab ? `/${currentTab}` : '';
 * });
 * ```
 */
export const useKuadrantNamespaceChange = (basePath: string, getCurrentSubPath?: () => string) => {
  const { ns } = useParams<{ ns: string }>();
  const [activeNamespace, setActiveNamespace] = useActiveNamespace();
  const navigate = useNavigate();
  const allNamespacesSubPath = '#ALL_NS#';

  // Sync URL namespace parameter with SDK active namespace
  React.useEffect(() => {
    if (ns && ns !== activeNamespace) {
      setActiveNamespace(ns);
    } else if (!ns && activeNamespace !== allNamespacesSubPath) {
      setActiveNamespace(allNamespacesSubPath);
    }
  }, [ns, activeNamespace, setActiveNamespace, allNamespacesSubPath]);

  /**
   * Handle namespace changes from the NamespaceBar
   * Navigates to the appropriate route based on selected namespace
   * Pattern: /kuadrant{basePath}[/ns/:ns][/subPath]
   * Example: /kuadrant/policies/ns/test-1/auth
   */
  const handleNamespaceChange = React.useCallback(
    (newNamespace: string) => {
      const subPath = getCurrentSubPath ? getCurrentSubPath() : '';

      if (newNamespace !== allNamespacesSubPath) {
        navigate(`/kuadrant${basePath}/ns/${newNamespace}${subPath}`, { replace: true });
      } else {
        navigate(`/kuadrant${basePath}${subPath}`, { replace: true });
      }
    },
    [navigate, basePath, allNamespacesSubPath, getCurrentSubPath],
  );

  return {
    handleNamespaceChange,
    activeNamespace,
  };
};
