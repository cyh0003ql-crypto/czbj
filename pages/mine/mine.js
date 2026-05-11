const app = getApp();

Page({
  data: {
    userInfo: {},
    isMerchant: false,
    couponCount: 3,
    orderCounts: { pendingPay: 1, pendingShip: 0, shipped: 2 }
  },

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo || {},
      isMerchant: app.globalData.isMerchant || wx.getStorageSync('isMerchant') || false
    });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 });
      this.getTabBar().updateCartCount();
    }
  },

  onUserTap() {
    if (this.data.userInfo.nickName) return;
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: res => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userInfo', userInfo);
        app.globalData.userInfo = userInfo;
        this.setData({ userInfo });
      },
      fail: () => {
        // 微信新政策下getUserProfile受限，使用默认头像
        const userInfo = { nickName: '创意玩家', avatarUrl: '' };
        this.setData({ userInfo });
      }
    });
  },

  goOrders(e) {
    const status = e?.currentTarget?.dataset?.status || 'all';
    wx.navigateTo({ url: `/pages/orderList/orderList?status=${status}` });
  },

  goOrderStatus(e) {
    const status = e.currentTarget.dataset.status;
    wx.navigateTo({ url: `/pages/orderList/orderList?status=${status}` });
  },

  goMenuItem(e) {
    const path = e.currentTarget.dataset.path;
    const routes = {
      wishlist: '/pages/wishlist/wishlist',
      address: '/pages/address/address',
      coupon: '/pages/coupon/coupon',
      customize: '/pages/customize/customize',
    };
    if (routes[path]) {
      wx.navigateTo({ url: routes[path] });
    } else if (path === 'about') {
      wx.showModal({
        title: 'Artful Living',
        content: '我们是一家专注于3D打印和创意生活定制的品牌。\n\nAppID: 待配置\n版本: v1.0.0\n\n让每个人都能实现自己的创意想法。',
        showCancel: false
      });
    } else if (path === 'setting') {
      wx.navigateTo({ url: '/pages/address/address' });
    }
  },

  contactService() {
    wx.openCustomerServiceChat({
      extInfo: { url: '' },
      corpId: 'your-corp-id',
      fail: () => {
        wx.showModal({
          title: '联系客服',
          content: '客服微信：artfulliving\n工作时间：周一至周六 9:00-21:00',
          showCancel: false
        });
      }
    });
  },

  goMerchant() {
    if (this.data.isMerchant) {
      wx.navigateTo({ url: '/pages/merchant/merchant' });
      return;
    }
    wx.showModal({
      title: '商家登录',
      editable: true,
      placeholderText: '请输入商家邀请码',
      success: res => {
        if (res.confirm && res.content === 'ARTFUL2024') {
          wx.setStorageSync('isMerchant', true);
          app.globalData.isMerchant = true;
          this.setData({ isMerchant: true });
          wx.showToast({ title: '身份验证成功', icon: 'success' });
          setTimeout(() => wx.navigateTo({ url: '/pages/merchant/merchant' }), 1000);
        } else if (res.confirm) {
          wx.showToast({ title: '邀请码错误（示例：ARTFUL2024）', icon: 'none', duration: 2500 });
        }
      }
    });
  }
});
