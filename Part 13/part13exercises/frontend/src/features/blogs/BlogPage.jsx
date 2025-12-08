import React, { useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { LoadingSpinner } from '../../components/utils/Icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, initializeBlogs, likeBlog, removeBlog } from './blogsSlice';
import { showNotification } from '../notification/notificationSlice';
import Pagination from '../../components/Pagination';

const Button = ({ label, onClick }) => (
  <button
    className='py-1.5 border-b-1 border-white/0 hover:border-secondary cursor-pointer'
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    {label}
  </button>
);

function BlogPage() {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.auth);
  const { id: blogIdParam } = useParams();
  const blogId = Number(blogIdParam);
  const commentRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch inicial
  useEffect(() => {
    if (blogs.status === 'idle') {
      dispatch(initializeBlogs());
    }
  }, [blogs.status, dispatch]);

  const blog = blogs.value.find((b) => b.id === blogId);

  useEffect(() => {
    if (blogs.status === 'succeeded' && !blog) {
      dispatch(
        showNotification({
          title: 'Blog Not Found',
          message: "We couldn't find the blog you're looking for",
          type: 'warning',
        })
      );
      navigate('/');
    }
  }, [blogs.status, blog, dispatch, navigate]);

  if (blogs.status === 'idle' || blogs.status === 'loading') {
    return (
      <div className='h-full bg-background text-secondary'>
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  if (!blog) return null;

  const comments = blog.comments || [];
  const publisher = blog.publisher || null;
  const { title, author, url, likes } = blog;

  const handleDelete = (id) => {
    dispatch(removeBlog(id));
    navigate('/');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    dispatch(addComment(blog.id, commentRef.current.value));
    commentRef.current.value = '';
  };

  const getRandomBlogId = () => {
    const index = Math.floor(Math.random() * blogs.value.length);
    if (blogs.value[index].id === blogId) {
      if (index === blogs.value.length - 1) return blogs.value[0].id;
      return blogs.value[index + 1].id;
    }
    return blogs.value[index].id;
  };

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <div className='w-full lg:w-[min(50%,768px)] h-[65%] md:h-[55%] lg:mx-auto mt-[3vh] lg:mt-[17vh] flex flex-col p-4 relative'>
        <span className='text-secondary text-4xl mb-1'>{title}</span>
        <span className='text-secondary text-md pl-2'>By {author}</span>

        <span className='text-secondary text-md pl-2 pt-4'>
          You can check out this post directly at the original source:
        </span>

        <a className='p-2 cursor-pointer text-sec-bg text-lg font-semibold truncate' href={url}>
          {url}
        </a>

        <span className='text-secondary text-md pl-2 pt-2'>
          Published here by{' '}
          {publisher ? (
            <span
              className='hover:text-secondary/50 cursor-pointer'
              onClick={() => navigate(`/users/${publisher.id}`)}
            >
              {publisher.name ?? 'Unnamed User'}
            </span>
          ) : (
            'Anonymous User'
          )}
        </span>

        <span className='text-secondary text-md pl-2 pt-2'>{likes} people liked this blog</span>

        <div className='flex pl-2 pt-4 w-full lg:justify-end text-secondary gap-3'>
          <Button label='Like' onClick={() => dispatch(likeBlog(blogId))} />

          {blogs.value.length > 1 && (
            <Button label='Next' onClick={() => navigate(`/blogs/${getRandomBlogId()}`)} />
          )}

          {publisher && publisher.id === user.userId && (
            <Button label='Delete' onClick={() => handleDelete(blogId)} />
          )}
        </div>

        {user.token && (
          <div className='w-full mt-4 text-secondary'>
            <form className='flex justify-between gap-2' onSubmit={handleCommentSubmit}>
              <input
                type='text'
                className='w-[90%] border-1 border-secondary rounded-2xl py-2.5 pl-2 text-secondary'
                placeholder='Write your comment here...'
                ref={commentRef}
              />
              <button
                type='submit'
                className='cursor-pointer text-secondary hover:text-secondary/50'
              >
                Send
              </button>
            </form>

            {comments.length > 0 ? (
              <Pagination
                items={comments}
                itemsPerPage={4}
                render={(itemsToShow) => (
                  <ul className='w-full pt-4 pl-8'>
                    {itemsToShow.map((comment, idx) => (
                      <li className='w-[88%] truncate' key={idx}>
                        "{comment}"
                      </li>
                    ))}
                  </ul>
                )}
              />
            ) : (
              <p className='w-full pt-4 text-center'>
                No comments yet, be the first one to comment
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
