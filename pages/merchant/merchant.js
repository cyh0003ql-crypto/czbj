Page({
  data: {
    showDashboard: false,
    stats: { quoting: 12, producing: 8, shipping: 15, completed: 128 },
    flowSteps: [
      { key: 'pending_quote', icon: '📋', label: '待报价', count: 12 },
      { key: 'modeling', icon: '🧊', label: '待建模', count: 8 },
      { key: 'printing', icon: '🖨', label: '待打印', count: 5 },
      { key: 'processing', icon: '✏', label: '后处理', count: 6 },
      { key: 'shipping', icon: '🚚', label: '待发货', count: 15 },
      { key: 'completed', icon: '✅', label: '已完成', count: 128 }
    ],
    dashboard: { todaySales: '3,280', todayOrders: 18, todayVisitors: 326, conversionRate: 5.5 }
  },

  onLoad() {
    this.checkMerchantAuth();
    this.loadStats();
  },

  checkMerchantAuth() {
    const isMerchant = wx.getStorageSync('isMerchant');
    if (!isMerchant) {
      wx.showModal({
        title: '权限不足', content: '请先通过「我的」页面登录商家账户',
        showCancel: false, success: () => wx.navigateBack()
      });
    }
  },

  loadStats() {
    // wx.cloud.callFunction({ name: 'orderManager', data: { action: 'getStats' } })
    //   .then(res => this.setData({ stats: res.result.data }));
  },

  goOrderList(e) {
    const status = e.currentTarget.dataset.status;
    wx.navigateTo({ url: `/pages/merchant/customOrders/customOrders?status=${status}` });
  },

  goProductList() {
    wx.navigateTo({ url: '/pages/merchant/productEdit/productEdit' });
  },

  goProductManage() {
    wx.navigateTo({ url: '/pages/merchant/productEdit/productEdit' });
  },

  goAddProduct() {
    wx.navigateTo({ url: '/pages/merchant/productEdit/productEdit' });
  },

  goCategoryManage() {
    wx.showToast({ title: '分类管理开发中', icon: 'none' });
  },

  goCustomOrders() {
    wx.navigateTo({ url: '/pages/merchant/customOrders/customOrders' });
  },

  goOrderManage() {
    wx.navigateTo({ url: '/pages/merchant/customOrders/customOrders' });
  },

  goCustomerManage() {
    wx.showToast({ title: '客户管理开发中', icon: 'none' });
  },

  goDashboard() {
    this.setData({ showDashboard: !this.data.showDashboard });
  },

  goActivity() {
    wx.showToast({ title: '活动设置开发中', icon: 'none' });
    // 预留活动设置接口
    // wx.navigateTo({ url: '/pages/merchant/activity' });
  },

  goCoupon() {
    wx.showToast({ title: '优惠券管理开发中', icon: 'none' });
    // 预留优惠券接口
    // wx.navigateTo({ url: '/pages/merchant/coupon' });
  },

  goShopSetting() {
    wx.showToast({ title: '店铺设置开发中', icon: 'none' });
  },

  goBack() {
    wx.navigateBack();
  }
});
