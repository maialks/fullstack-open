import { configureStore } from '@reduxjs/toolkit'
import blogsReducer from '../features/blogs/blogsSlice'
import authReducer from '../features/auth/authSlice'
import notificationReducer from '../features/notification/notificationSlice'
import usersReducer from '../features/users/usersSlice'

export default configureStore({
  reducer: {
    blogs: blogsReducer,
    users: usersReducer,
    auth: authReducer,
    notification: notificationReducer,
  },
})
