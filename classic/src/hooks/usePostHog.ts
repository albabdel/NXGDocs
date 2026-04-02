import { useCallback, useEffect, useState } from 'react';
import { getProductConfig } from '../utils/productConfig';

declare global {
  interface Window {
    posthog?: {
      capture: (eventName: string, properties?: Record<string, unknown>) => void;
      identify: (distinctId: string, properties?: Record<string, unknown>) => void;
      setPersonProperties: (properties: Record<string, unknown>) => void;
      reset: () => void;
      get_distinct_id: () => string;
      isFeatureEnabled: (key: string) => boolean | undefined;
      getFeatureFlag: (key: string) => string | boolean | undefined;
      onFeatureFlags: (callback: () => void) => void;
      reloadFeatureFlags: () => void;
      debug: (enabled: boolean) => void;
      group: (groupType: string, groupKey: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export const EVENT_NAMES = {
  PAGE_VIEW: 'page_view',
  DOC_VIEW: 'doc_view',
  SEARCH_QUERY: 'search_query',
  SEARCH_RESULT_CLICK: 'search_result_click',
  SIDEBAR_CLICK: 'sidebar_click',
  NAV_CLICK: 'nav_click',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  PDF_DOWNLOADED: 'pdf_downloaded',
  THEME_CHANGED: 'theme_changed',
  LANGUAGE_CHANGED: 'language_changed',
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',
  ERROR_OCCURRED: 'error_occurred',
  TICKET_CREATED: 'ticket_created',
  TICKET_VIEWED: 'ticket_viewed',
  RELEASE_VIEWED: 'release_viewed',
  LANDING_PAGE_VIEWED: 'landing_page_viewed',
  INTEGRATION_VIEWED: 'integration_viewed',
} as const;

export function usePostHog() {
  const identify = useCallback((userId: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.posthog && userId) {
      window.posthog.identify(userId, properties);
    }
  }, []);

  const capture = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(eventName, properties);
    }
  }, []);

  const setPersonProperties = useCallback((properties: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.setPersonProperties(properties);
    }
  }, []);

  const reset = useCallback(() => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.reset();
    }
  }, []);

  const getDistinctId = useCallback(() => {
    if (typeof window !== 'undefined' && window.posthog) {
      return window.posthog.get_distinct_id();
    }
    return null;
  }, []);

  const isFeatureEnabled = useCallback((flagKey: string) => {
    if (typeof window !== 'undefined' && window.posthog) {
      return window.posthog.isFeatureEnabled(flagKey) ?? false;
    }
    return false;
  }, []);

  const getFeatureFlag = useCallback((flagKey: string) => {
    if (typeof window !== 'undefined' && window.posthog) {
      return window.posthog.getFeatureFlag(flagKey);
    }
    return undefined;
  }, []);

  const onFeatureFlags = useCallback((callback: () => void) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.onFeatureFlags(callback);
    }
  }, []);

  const reloadFeatureFlags = useCallback(() => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.reloadFeatureFlags();
    }
  }, []);

  const debug = useCallback((enabled: boolean) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.debug(enabled);
    }
  }, []);

  return {
    identify,
    capture,
    setPersonProperties,
    reset,
    getDistinctId,
    isFeatureEnabled,
    getFeatureFlag,
    onFeatureFlags,
    reloadFeatureFlags,
    debug,
    EVENT_NAMES,
  };
}

export function useFeatureFlag(flagKey: string) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [variant, setVariant] = useState<string | boolean | null>(null);
  const { isFeatureEnabled, getFeatureFlag } = usePostHog();

  useEffect(() => {
    setIsEnabled(isFeatureEnabled(flagKey));
    const flag = getFeatureFlag(flagKey);
    setVariant(flag ?? null);
  }, [flagKey, isFeatureEnabled, getFeatureFlag]);

  return { isEnabled, variant };
}

export function useTrackEvent(eventName: string, properties?: Record<string, unknown>, deps: unknown[] = []) {
  const { capture } = usePostHog();

  useEffect(() => {
    capture(eventName, properties);
  }, [capture, eventName, properties, ...deps]);
}

export function useIdentifyUser(userId: string | null, properties?: Record<string, unknown>) {
  const { identify } = usePostHog();

  useEffect(() => {
    if (userId) {
      identify(userId, properties);
    }
  }, [identify, userId, properties]);
}

export function useTrackDocView() {
  const { capture } = usePostHog();

  return useCallback((docId: string, docTitle: string, docPath: string, category?: string) => {
    const productConfig = getProductConfig();
    capture(EVENT_NAMES.DOC_VIEW, {
      doc_id: docId,
      doc_title: docTitle,
      doc_path: docPath,
      category,
      product: productConfig.id,
    });
  }, [capture]);
}

export function useTrackSearch() {
  const { capture } = usePostHog();

  return useCallback((query: string, resultCount: number, searchMode: string = 'keyword') => {
    const productConfig = getProductConfig();
    capture(EVENT_NAMES.SEARCH_QUERY, {
      query: query.toLowerCase(),
      result_count: resultCount,
      search_mode: searchMode,
      product: productConfig.id,
    });
  }, [capture]);
}

export function useTrackSearchClick() {
  const { capture } = usePostHog();

  return useCallback((
    query: string,
    resultId: string,
    resultTitle: string,
    resultUrl: string,
    position: number
  ) => {
    const productConfig = getProductConfig();
    capture(EVENT_NAMES.SEARCH_RESULT_CLICK, {
      query: query.toLowerCase(),
      result_id: resultId,
      result_title: resultTitle,
      result_url: resultUrl,
      position,
      product: productConfig.id,
    });
  }, [capture]);
}
