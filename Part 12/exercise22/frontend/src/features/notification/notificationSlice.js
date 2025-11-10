import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    visible: false,
    title: null,
    message: null,
    type: null, // 'success' | 'error' | 'info' | 'warning'
  },
  reducers: {
    setNotification: (state, action) => {
      state.title = action.payload.title
      state.message = action.payload.message
      state.type = action.payload.type
      state.visible = true
    },
    clearNotification: (state) => {
      state.visible = false
      state.message = null
      state.type = null
      state.title = null
    },
  },
})

export const showNotification = ({ title, message, type, duration = 3000 }) => {
  return async (dispatch) => {
    dispatch(setNotification({ message, type, title }))
    await new Promise((resolve) => setTimeout(resolve, duration))
    dispatch(clearNotification())
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions

export default notificationSlice.reducer
