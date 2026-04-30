export const SIGNUP = '/user/signup';
export const LOGIN = '/user/login';
export const ADMIN_LOGIN = '/user/adminLogin';
export const SEND_OTP = '/user/send-otp';
export const VERIFY_OTP = '/user/verify-otp';
export const FORGOT_PASSWORD = '/user/forgot-password';
export const RESET_PASSWORD = '/user/reset-password';
export const GET_ALL_BROKERS = 'broker/getAllBroker';
export const GET_ALL_TRADING_ACCOUNTS = 'tradingAccount/getAllTradingAccount';
export const CREATE_TRADING_ACCOUNT = 'tradingAccount/create';
export const UPDATE_TRADING_ACCOUNT = 'tradingAccount/updateTradingAccount';
export const DELETE_TRADING_ACCOUNT = 'tradingAccount/deleteTradingAccount';
export const GET_ALL_FAQ = '/faq/getAll';
export const CREATE_CONTACT_US = '/contactUs/create';
export const UPLOAD_USER_DOCUMENT = '/userDocument/uploadUserDocument';
export const UPLOAD_IMAGE = '/user/upload-image';

// Admin APIs
export const GET_ALL_USERS = '/user/getAllUsers';
export const GET_ALL_IB_REQUESTS = '/ibUser/getAllIbUserRequest';
export const UPDATE_IB_REQUEST = '/ibUser/updateIbUserRequest';
export const GET_ALL_KYC_DOCUMENTS = '/userDocument/getAllDocument';
export const UPDATE_KYC_DOCUMENT = '/userDocument/updateUserDocument';
// Transaction APIs moved to common transaction endpoints

export const BLOCK_USER = '/user/blockUser';
export const ADD_SUB_ADMIN = '/user/addSubAdmin';
export const UPDATE_SUB_ADMIN = '/user/subAdminUpdate';
export const DELETE_SUB_ADMIN = '/user/deleteUser';
export const GET_ALL_SUB_ADMINS = '/user/getAllSubAdmin';
export const CREATE_NOTIFICATION = '/notification/createNewNotification';
export const CREATE_POPUP = '/notification/createNewPopUp';
export const GET_POPUP = '/notification/getPopUp';
export const GET_SETTING = '/utilitySetting/getSetting';
export const UPDATE_SETTING = '/utilitySetting/updateSetting';

// Brokers
export const CREATE_BROKER = '/broker/create';
export const GET_ALL_BROKERS_ADMIN = '/broker/getAllBroker';
export const UPDATE_BROKER = '/broker/updateBroker';
export const DELETE_BROKER = '/broker/deleteBroker';

// Tutorials
export const CREATE_TUTORIAL = '/tutorial/create';
export const GET_ALL_TUTORIALS = '/tutorial/getAll';
export const UPDATE_TUTORIAL = '/tutorial/update';
export const DELETE_TUTORIAL = '/tutorial/deleteTutorial';

// IB Clients & Income
export const GET_IB_CLIENTS = '/ibUser/getIbClient';
export const GET_ADMIN_IB_INCOME = '/ibUser/getAdminIbIncome';
export const GET_ADMIN_PROFIT_SHARING = '/ibUser/getAdminProfitSharing';

// Contact Us
export const GET_ALL_CONTACT_US = '/contactUs/getAll';

// Notifications
export const GET_ALL_NOTIFICATIONS = '/notification/getAllNotification';
export const UPDATE_NOTIFICATION = '/notification/updateNotification';

// Transactions
export const GET_ALL_TRANSACTIONS = '/transaction/getAllTransaction';
export const UPDATE_TRANSACTION = '/transaction/updateTransaction';

// Trade History
export const GET_USER_DASHBOARD_PROFIT_LOTS = '/tradesHistory/getUserDashboardProfitLots';
export const GET_ADMIN_DASHBOARD_STATS = '/tradesHistory/getAdminDashboardUseDepoWith';
export const GET_ADMIN_PROFIT_AND_IB_COMMISSION = '/tradesHistory/getAdminProfitAndIbcommission';
