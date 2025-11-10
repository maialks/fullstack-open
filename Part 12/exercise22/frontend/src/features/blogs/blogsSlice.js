import { createSlice } from '@reduxjs/toolkit'
import blogService from '../../services/blogService'
import { showNotification } from '../notification/notificationSlice'

export const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    value: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setLoading: (state) => {
      state.status = 'loading'
    },
    setBlogs: (state, action) => {
      state.value = action.payload
      state.status = 'succeeded'
    },
    setError: (state, action) => {
      state.status = 'failed'
      state.error = action.payload
    },
    addBlog: (state, action) => {
      state.value.push(action.payload)
    },
    updateBlog: (state, action) => {
      const updated = action.payload
      const index = state.value.findIndex((b) => b.id === updated.id)
      if (index !== -1) state.value[index] = updated
    },
  },
})

export const { setBlogs, updateBlog, setLoading, setError, addBlog } =
  blogsSlice.actions

export const initializeBlogs = () => async (dispatch) => {
  try {
    dispatch(setLoading())
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const likeBlog = (id) => async (dispatch, getState) => {
  const blog = getState().blogs.value.find((b) => b.id === id)
  const updated = { ...blog, likes: blog.likes + 1 }
  await blogService.update(updated)
  dispatch(updateBlog(updated))
}

export const addComment = (id, comment) => async (dispatch, getState) => {
  const blog = getState().blogs.value.find((b) => b.id === id)
  const updated = { ...blog, comments: [...blog.comments, comment] }
  await blogService.update(updated)
  dispatch(updateBlog(updated))
}

export const createBlog = (blog) => async (dispatch, getState) => {
  try {
    const newBlog = await blogService.create(blog, getState().auth.token)
    dispatch(addBlog(newBlog))
    dispatch(
      showNotification({
        title: 'Blog Added Successfully',
        message: `${newBlog.publisher.name}, your blog was added successfully`,
        type: 'success',
        duration: 2000,
      })
    )
    return true
  } catch (err) {
    return err
  }
}

export const removeBlog = (id) => async (dispatch, getState) => {
  try {
    await blogService.remove(id, getState().auth.token)
    dispatch(
      showNotification({
        title: 'Blog Deleted Successfully',
        type: 'success',
        duration: 2000,
      })
    )
    const oldBlogs = getState((state) => state.blogs.value)
    dispatch(setBlogs(oldBlogs.filter((b) => b.id !== id)))
  } catch (err) {
    showNotification({
      title: 'Blog Deletion Faild',
      message: `${err.message}`,
      type: 'error',
      duration: 2000,
    })
  }
}

export default blogsSlice.reducer
