import { combineReducers } from '@reduxjs/toolkit';

import loginReducer, {
  loginUser,
  adminLoginUser,
  resetPassword,
  clearLoginState,
  logout,
  markAllRead,
  addNotification,
  fetchNotifications,
  updateNotification,
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
  updateTransaction,
  blockUser,
  fetchAllSubAdmins,
  addSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  clearAdminState,
  fetchIbClients,
  fetchAllContactUs,
  fetchAdminIbIncome,
  fetchAdminProfitSharing,
  fetchTransactions,
  fetchUserDashboardProfitLots,
} from '@/store/slice/adminSlice';

import contentReducer, {
  fetchBrokersAdmin,
  createBroker,
  updateBroker,
  deleteBroker,
  fetchTutorials,
  createTutorial,
  updateTutorial,
  deleteTutorial,
} from '@/store/slice/contentSlice';

const reducer = combineReducers({
  login: loginReducer,
  account: accountReducer,
  admin: adminReducer,
  content: contentReducer,
});

export {
  // login
  loginUser,
  adminLoginUser,
  resetPassword,
  clearLoginState,
  logout,
  markAllRead,
  addNotification,
  fetchNotifications,
  updateNotification,
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
  updateTransaction,
  blockUser,
  fetchAllSubAdmins,
  addSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  clearAdminState,
  fetchIbClients,
  fetchAllContactUs,
  fetchAdminIbIncome,
  fetchAdminProfitSharing,
  fetchTransactions,
  fetchUserDashboardProfitLots,
  // content
  fetchBrokersAdmin,
  createBroker,
  updateBroker,
  deleteBroker,
  fetchTutorials,
  createTutorial,
  updateTutorial,
  deleteTutorial,
};

export default reducer;
