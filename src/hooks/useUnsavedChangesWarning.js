import { useEffect, useContext, useRef } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

/**
 * Hook to warn users about unsaved changes when navigating away
 * @param {boolean} hasUnsavedChanges - Whether there are unsaved changes
 * @param {string} message - Custom warning message (optional)
 */
export const useUnsavedChangesWarning = (
  hasUnsavedChanges,
  message = '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.'
) => {
  const navigator = useContext(NavigationContext).navigator;
  const unblockRef = useRef(null);

  // Handle browser refresh/close/back button
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  // Intercept navigation using history.block (if available) or monkey-patch navigator
  // Note: This uses UNSAFE_NavigationContext as a workaround for legacy BrowserRouter
  // which doesn't support the newer useBlocker hook
  useEffect(() => {
    if (!hasUnsavedChanges) {
      // Clear any existing block
      if (unblockRef.current) {
        unblockRef.current();
        unblockRef.current = null;
      }
      return;
    }

    // Store original push/replace methods
    const originalPush = navigator.push;
    const originalReplace = navigator.replace;

    // Override push
    navigator.push = function (...args) {
      if (window.confirm(message)) {
        originalPush.apply(navigator, args);
      }
    };

    // Override replace
    navigator.replace = function (...args) {
      if (window.confirm(message)) {
        originalReplace.apply(navigator, args);
      }
    };

    // Store cleanup function
    unblockRef.current = () => {
      navigator.push = originalPush;
      navigator.replace = originalReplace;
    };

    return () => {
      // Restore original methods
      if (unblockRef.current) {
        unblockRef.current();
        unblockRef.current = null;
      }
    };
  }, [hasUnsavedChanges, message, navigator]);

  // Handle browser back/forward buttons
  // Note: This approach has limitations across browsers but provides basic protection
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    let historyPushed = false;

    const handlePopState = () => {
      if (!window.confirm(message)) {
        // Push state back to prevent navigation
        // Only do this if we haven't already to avoid polluting history
        if (!historyPushed) {
          window.history.pushState(null, '', window.location.pathname);
          historyPushed = true;
        }
      }
    };

    // Add a dummy state to catch back button (only once)
    if (!historyPushed) {
      window.history.pushState(null, '', window.location.pathname);
      historyPushed = true;
    }
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges, message]);
};

export default useUnsavedChangesWarning;
