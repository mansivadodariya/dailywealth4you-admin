import { combineReducers } from '@reduxjs/toolkit';
import loginReducer, {
  adminLoginUser,
  clearLoginState,
  loginUser,
  resetPassword,
  logout,
} from '@/store/slice/loginSlice';


const reducer = combineReducers({
  login: loginReducer,
});

export {
  signupUser,
  loginUser,
  adminLoginUser,
  resetPassword,
  clearLoginState,
  logout,
  sendOtp,
  verifyOtp,
  forgotPassword,
  clearOtpState,
  fetchBrokers,
  fetchTradingAccounts,
  clearAccountState,
};
export default reducer;
