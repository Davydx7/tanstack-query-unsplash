/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { createApi } from 'unsplash-js';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  const [page, setPage] = React.useState('posts');

  return (
    <QueryClientProvider client={queryClient}>
      <p>
        This is a fork of Tanstak 'basic example'
        <br />
        Tanstack devtools shows unsplash api call has been cached after the
        first call, but the keeps fetching the api everytime the component
        mounts?,
        <br />
        The posts call behaves as expected
      </p>
      <p>
        <a href="#" onClick={() => setPage('posts')}>
          Posts
        </a>
        <br />
        <a href="#" onClick={() => setPage('pictures')}>
          pictures
        </a>
      </p>
      {page === 'posts' ? <Posts /> : <Pictures />}
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

const unsplash = createApi({
  accessKey: 'ltCPDyi9yVK9VuCoGBL5wlndviDS6CpJzmsUKmXwUf8',
});

function useUnsplash(query, perPage) {
  return useQuery({
    queryKey: ['unsplash'],
    queryFn: async () => {
      const results = await unsplash.search
        .getPhotos({
          query,
          perPage,
        })
        .then((result) => {
          return result.response?.results;
        })
        .catch((error) => {
          throw new Error(error);
        });

      return results;
    },
    staleTime: Infinity,
  });
}

function Pictures() {
  const { data, status, error, isFetching } = useUnsplash('cats', 4);

  return (
    <div>
      <h1>Pictures</h1>
      <div>
        {status === 'pending' ? (
          'Loading...'
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.map((picture) => (
                <img
                  key={picture.id}
                  src={picture.urls.regular}
                  alt="aboutImg"
                  width="25%"
                />
              ))}
            </div>
            <div>{isFetching ? 'Background Updating...' : ''}</div>
          </>
        )}
      </div>
    </div>
  );
}

function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await axios.get(
        'https://jsonplaceholder.typicode.com/posts'
      );
      return data;
    },
    staleTime: Infinity,
  });
}

function Posts() {
  const { status, data, error, isFetching } = usePosts();

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {status === 'pending' ? (
          'Loading...'
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.map((post) => (
                <p key={post.id}>{post.title}</p>
              ))}
            </div>
            <div>{isFetching ? 'Background Updating...' : ''}</div>
          </>
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(<App />);
