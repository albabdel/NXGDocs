import React, { useCallback, useState } from 'react';
import { usePostHog, useFeatureFlag, EVENT_NAMES } from '../hooks/usePostHog';

export function ExamplePageTracking() {
  const { capture } = usePostHog();

  const handleDownload = useCallback(() => {
    capture(EVENT_NAMES.PDF_DOWNLOADED, {
      document_id: 'doc-123',
      document_title: 'Getting Started Guide',
      file_format: 'pdf',
    });
  }, [capture]);

  return (
    <button onClick={handleDownload}>
      Download PDF
    </button>
  );
}

export function ExampleFeatureFlag() {
  const { isEnabled, variant } = useFeatureFlag('new_dashboard_layout');

  if (!isEnabled) {
    return <div>Default Dashboard</div>;
  }

  return (
    <div>
      <h2>New Dashboard ({variant})</h2>
    </div>
  );
}

export function ExampleSearchTracking() {
  const { capture } = usePostHog();
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((searchQuery: string) => {
    capture(EVENT_NAMES.SEARCH_QUERY, {
      query: searchQuery,
      query_length: searchQuery.length,
      timestamp: Date.now(),
    });
  }, [capture]);

  const handleResultClick = useCallback((resultId: string, position: number) => {
    capture(EVENT_NAMES.SEARCH_RESULT_CLICK, {
      result_id: resultId,
      position: position,
      query: query,
    });
  }, [capture, query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
      />
    </div>
  );
}

export function ExampleUserIdentification() {
  const { identify, reset } = usePostHog();

  const handleLogin = useCallback(() => {
    identify('user-123', {
      email: 'user@example.com',
      name: 'John Doe',
      role: 'admin',
      company: 'NXGEN',
    });
  }, [identify]);

  const handleLogout = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export function ExampleDebugMode() {
  const { debug } = usePostHog();

  return (
    <button onClick={() => debug(true)}>
      Enable Debug Mode
    </button>
  );
}
