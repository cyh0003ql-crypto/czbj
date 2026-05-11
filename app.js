App({
  globalData: {
    userInfo: null,
    isMerchant: false,
    cartCount: 0,
    baseUrl: '',
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
    }
    const isMerchant = wx.getStorageSync('isMerchant');
    this.globalData.isMerchant = !!isMerchant;
  },

  getCartCount() {
    const cart = wx.getStorageSync('cart') || [];
    this.globalData.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  updateCartCount() {
    this.getCartCount();
  },
});
