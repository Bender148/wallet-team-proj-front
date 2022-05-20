import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = 'https://wallet-team-proj.herokuapp.com'

const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  },
  unSet() {
    axios.defaults.headers.common.Authorization = ''
  },
}

const signUp = createAsyncThunk(
  'session/signUp',
  async (credentials, thunkAPI) => {
    try {
      await axios.post('/auth/registration', credentials)

      toast.success('Регистрация прошла успешно')
      return
    } catch (error) {
      toast.error(error.response.data.message)

      return thunkAPI.rejectWithValue(error.response.data)
    }
  },
)

const logIn = createAsyncThunk(
  'session/logIn',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axios.post('/auth/login', credentials)

      token.set(data.user.token)

      return data
    } catch (error) {
      toast.error(error.response.data.message)

      return thunkAPI.rejectWithValue(error.response.data)
    }
  },
)

const refreshCurrentUser = createAsyncThunk(
  'session/refreshCurrentUser',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    const persistedToken = state.session.token

    if (persistedToken === null) {
      return thunkAPI.rejectWithValue()
    }

    token.set(persistedToken)

    try {
      const { data } = await axios.get('/users/current')

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue()
    }
  },
)

const logOut = createAsyncThunk('session/logout', async (_, thunkAPI) => {
  try {
    await axios.post('/auth/logout')

    token.unSet()
  } catch (error) {
    toast.error(error.response.data.message)

    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export { signUp, logIn, refreshCurrentUser, logOut }
