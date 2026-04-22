import { combineReducers } from '@reduxjs/toolkit';

import loginReducer, {
  loginUser,
  adminLoginUser,
  resetPassword,
  clearLoginState,
  logout,
} from '@/store/slice/loginSlice';

import accountReducer, {
  fetchBrokers,
  fetchTradingAccounts,
  clearAccountState,
  uploadUserDocument,
  uploadImage,
} from '@/store/slice/accountSlice';

import adminReducer, {
  fetchAllUsers,
  fetchIbRequests,
  updateIbRequest,
  fetchAllKycDocuments,
  updateKycDocument,
  fetchWithdrawRequests,
  updateWithdrawRequest,
  blockUser,
  clearAdminState,
} from '@/store/slice/adminSlice';

const reducer = combineReducers({
  login: loginReducer,
  account: accountReducer,
  admin: adminReducer,
});

export {
  // login
  loginUser,
  adminLoginUser,
  resetPassword,
  clearLoginState,
  logout,
  // account
  fetchBrokers,
  fetchTradingAccounts,
  clearAccountState,
  uploadUserDocument,
  uploadImage,
  // admin
  fetchAllUsers,
  fetchIbRequests,
  updateIbRequest,
  fetchAllKycDocuments,
  updateKycDocument,
  fetchWithdrawRequests,
  updateWithdrawRequest,
  blockUser,
  clearAdminState,
};

export default reducer;
