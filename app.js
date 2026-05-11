App({
  globalData: {
    userInfo: null,
    isMerchant: false,
    isLoggedIn: false,
    cartCount: 0,
    baseUrl: '',
    selectedAddress: null,
  },

  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-env-id',
        traceUser: true,
      });
    }
    this.getUserInfo();
    this.getCartCount();
  },

  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLoggedIn = true;
    }
    const isMerchant = wx.getStorageSync('isMerchant');
    this.globalData.isMerchant = !!isMerchant;
  },

  login(userInfo) {
    wx.setStorageSync('userInfo', userInfo);
    this.globalData.userInfo = userInfo;
    this.globalData.isLoggedIn = true;
  },

  logout() {
    wx.removeStorageSync('userInfo');
    this.globalData.userInfo = null;
    this.globalData.isLoggedIn = false;
  },

  getCartCount() {
    const cart = wx.getStorageSync('cart') || [];
    this.globalData.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  updateCartCount() {
    this.getCartCount();
  },

  getMerchantAccounts() {
    return wx.getStorageSync('merchantAccounts') || { subAccounts: [] };
  },

  saveMerchantAccounts(data) {
    wx.setStorageSync('merchantAccounts', data);
  },
});
