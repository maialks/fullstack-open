import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Pagination from '../../components/Pagination';
import Notification from '../notification/Notification';
import Title from '../../components/Title';
import { useDispatch, useSelector } from 'react-redux';
import { initializeBlogs } from './/blogsSlice';
import BlogsContainer from './BlogsContainer';

export default function Homepage() {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.value);
  const notification = useSelector((state) => state.notification);
  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);
  return (
    <div id='main' className='min-h-screen bg-background'>
      <Navbar />
      {notification.visible && <Notification />}
      <Title>
        the
        <br />
        bloglist
      </Title>
      <Pagination
        items={blogs}
        itemsPerPage={8}
        render={(itemsToShow) => <BlogsContainer blogs={itemsToShow} />}
      />
    </div>
  );
}
