import { useState } from 'react';

/**
 * Manages a search input with a separately tracked "submitted" query.
 * submittedSearchQuery updates on every keystroke (live filter).
 */
export function useSearch(initial = '') {
  const [searchQuery, setSearchQuery] = useState(initial);
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState(initial);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setSubmittedSearchQuery(value);
  };

  return { searchQuery, submittedSearchQuery, handleSearchChange };
}
