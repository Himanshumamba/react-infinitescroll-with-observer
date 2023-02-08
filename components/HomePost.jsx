import { useState, useRef, useCallback } from 'react';
import usePosts from '../hooks/usePosts';
import Post from './Post';
const HomePost = () => {
  const [pageNumber, setpageNumber] = useState(1);
  const { results, isLoading, isError, error, hasNextpage } =
    usePosts(pageNumber);
  const intObserver = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isLoading) return;
      if (intObserver.current) intObserver.current.disconnect();
      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextpage) {
          console.log('we are near the last pot');
          setpageNumber((prev) => prev + 1);
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [isLoading, hasNextpage]
  );
  if (isError) return <p> Error :{error.message}</p>;
  const content = results.map((post, i) => {
    if (results.length === i + 1) {
      return <Post ref={lastPostRef} Key={post.id} post={post} />;
    }
    return <Post Key={post.id} post={post} />;
  });
  return (
    <>
      <h1> Scroller </h1>
      {content}
      {isLoading && <p className="loader"> Loading.... </p>}
      <p> back to top </p>
    </>
  );
};

export default HomePost;
