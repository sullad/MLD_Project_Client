import {
  AnyAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { authService } from "./userService";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const LOGIN_STATUS = {
  SUCCESS: 1,
  USERNAME_NOT_FOUND: 2,
  WRONG_PASSWORD: 3,
  FIRST_LOGIN: 4
};

const AUTHENTICATION_STATUS = {
  NOT_LOGIN: 0,
  SUCCESS: 1,
  FAIL: 2,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: any, thunkAPI) => {
    try {
      const res = await authService.login(userData);
      return { res, status: LOGIN_STATUS.SUCCESS };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const checkAuthenticationUser = createAsyncThunk(
  "auth/checkAuthentication",
  async (_, thunkAPI) => {
    try {
      const res = await authService.checkAuthentication();
      if (res?.trim() !== "") {
        const words = res.split(' ');
        const email = words.find((word: string) => word.includes('@'));
        const userId = words.pop();
        const role = words.pop();
        const usernameArr = words.filter((word: string) => word !== email && word !== role);
        const username = usernameArr.join(' ');
        const result = { username, email, role, userId }
        return { result, status: AUTHENTICATION_STATUS.SUCCESS };
      }
      else {
        return { res, status: AUTHENTICATION_STATUS.FAIL };
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const res = await authService.logout();
      console.log(res);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

interface UserState {
  user: any | null;
  token: any;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string | null;
  loginStatus: number | null;
  authStatus: number | null;
}

const initialState = {
  user: null,
  token: '',
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: null,
  loginStatus: 0,
  authStatus: 0
} as UserState;

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    resetState: (state) => {
      state.user = null;
      state.token = '';
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.loginStatus = 0;
      state.authStatus = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload.res;
        state.loginStatus = 1;
        localStorage.setItem('token', action.payload.res);
        window.location.reload();
        alert("Đăng nhập thành công")
      })
      .addCase(checkAuthenticationUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthenticationUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload.result;
        if (action.payload.result) {
          state.loginStatus = 1;
          state.authStatus = 1;
        }
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = null;
        state.loginStatus = 0;
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: AnyAction) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
          if (
            action.payload.response.data === "Please change your password on first login."
          ) {
            alert("Please change your password on first login.")
            state.loginStatus = 4
          }
          else if (
            action.payload.response?.data.status === LOGIN_STATUS.WRONG_PASSWORD
          )
            alert("Sai mật khẩu")
        },
      );
  },
});

export default authSlice.reducer;
