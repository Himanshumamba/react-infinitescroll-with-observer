import { useState, useEffect } from 'react';
import { getPost } from '../api/axios';
import React from 'react';

const usePosts = (pageNumber = 1) => {
  const [results, setResults] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextpage, setHasNextpage] = useState(false);

  useEffect(() => {
    setLoading(true);
    setIsError(false);
    setError({});
    const controller = new AbortController();
    const { signal } = controller;

    getPost(pageNumber, { signal })
      .then((data) => {
        setResults((prev) => [...prev, ...data]);
        setHasNextpage(Boolean(data.length));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (signal.aborted) return;

        setIsError(true);
        setError({ message: error.message });
      });

    return () => controller.abort();
  }, [pageNumber]);

  return { results, isLoading, isError, error, hasNextpage };
};

export default usePosts;
