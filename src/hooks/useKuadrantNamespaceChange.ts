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
 *
 * @param basePath - The base path for the page (e.g., '/apiproducts', '/policies')
 * @returns An object with handleNamespaceChange function and activeNamespace
 *
 * @example
 * ```tsx
 * const { handleNamespaceChange, activeNamespace } = useKuadrantNamespaceChange('/apiproducts');
 * return (
 *   <>
 *     <NamespaceBar onNamespaceChange={handleNamespaceChange} />
 *     <PageSection>...</PageSection>
 *   </>
 * );
 * ```
 */
export const useKuadrantNamespaceChange = (basePath: string) => {
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
   * Pattern: /kuadrant{basePath} or /kuadrant{basePath}/ns/:ns
   */
  const handleNamespaceChange = React.useCallback(
    (newNamespace: string) => {
      if (newNamespace !== allNamespacesSubPath) {
        navigate(`/kuadrant${basePath}/ns/${newNamespace}`, { replace: true });
      } else {
        navigate(`/kuadrant${basePath}`, { replace: true });
      }
    },
    [navigate, basePath, allNamespacesSubPath],
  );

  return {
    handleNamespaceChange,
    activeNamespace,
  };
};
