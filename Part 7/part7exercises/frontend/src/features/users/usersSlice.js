import { createSlice } from '@reduxjs/toolkit'
import userService from '../../services/userService'

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    value: [],
    status: 'idle',
  },
  reducers: {
    setLoading: (state) => {
      state.status = 'loading'
    },
    setUsers: (state, action) => {
      state.value = action.payload
      state.status = 'succeeded'
    },
    setError: (state, action) => {
      state.status = 'failed'
      state.error = action.payload
    },
  },
})

export const { setLoading, setUsers, setError } = usersSlice.actions

export const initializeUsers = () => async (dispatch) => {
  try {
    dispatch(setLoading())
    const users = await userService.getAll()
    dispatch(setUsers(users))
  } catch (err) {
    console.log(err)
  }
}

export default usersSlice.reducer
