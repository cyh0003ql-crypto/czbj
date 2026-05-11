const app = getApp();

Page({
  data: {
    showPhoneForm: false,
    phone: '',
    smsCode: '',
    agreed: true,
    smsSent: false,
    countdown: 60,
    redirectUrl: '',
    canUseGetUserProfile: false,
  },

  onLoad(options) {
    this.setData({ redirectUrl: options.redirect || '' });
    // 判断基础库版本
    const info = wx.getSystemInfoSync();
    this.setData({ canUseGetUserProfile: true });
  },

  // 微信一键登录
  onWechatLogin() {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' }); return;
    }
    wx.showLoading({ title: '登录中...', mask: true });
    // 真实场景：wx.login 获取 code → 云函数换取 openid → 获取用户信息
    // 这里模拟登录流程
    wx.getUserProfile({
      desc: '用于登录 Artful Living',
      success: res => {
        wx.hideLoading();
        const userInfo = res.userInfo;
        app.login(userInfo);
        wx.showToast({ title: '登录成功', icon: 'success', duration: 1200 });
        setTimeout(() => this.afterLogin(), 1200);
      },
      fail: () => {
        wx.hideLoading();
        // 基础库限制时用模拟数据
        const userInfo = {
          nickName: '创意玩家',
          avatarUrl: 'https://picsum.photos/100/100?random=99',
          gender: 0
        };
        app.login(userInfo);
        wx.showToast({ title: '登录成功', icon: 'success', duration: 1200 });
        setTimeout(() => this.afterLogin(), 1200);
      }
    });
  },

  // 手机号登录
  onPhoneLogin() {
    if (!this.data.agreed) { wx.showToast({ title: '请先同意用户协议', icon: 'none' }); return; }
    if (!this.data.phone || this.data.phone.length !== 11) { wx.showToast({ title: '请输入正确的手机号', icon: 'none' }); return; }
    if (!this.data.smsCode) { wx.showToast({ title: '请输入验证码', icon: 'none' }); return; }

    wx.showLoading({ title: '验证中...', mask: true });
    setTimeout(() => {
      wx.hideLoading();
      const phone = this.data.phone;
      const userInfo = {
        nickName: phone.substring(0, 3) + '****' + phone.substring(7),
        avatarUrl: 'https://picsum.photos/100/100?random=88',
        phone,
        gender: 0
      };
      app.login(userInfo);
      wx.showToast({ title: '登录成功', icon: 'success', duration: 1200 });
      setTimeout(() => this.afterLogin(), 1200);
    }, 1000);
  },

  sendSms() {
    if (!this.data.phone || this.data.phone.length !== 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' }); return;
    }
    if (this.data.smsSent) return;
    // 云函数调用示例
    // wx.cloud.callFunction({ name: 'userManager', data: { action: 'sendSms', phone: this.data.phone } })
    wx.showToast({ title: '验证码已发送（演示：123456）', icon: 'none', duration: 2500 });
    this.setData({ smsSent: true, countdown: 60 });
    const timer = setInterval(() => {
      const n = this.data.countdown - 1;
      if (n <= 0) { clearInterval(timer); this.setData({ smsSent: false, countdown: 60 }); }
      else this.setData({ countdown: n });
    }, 1000);
  },

  togglePhoneForm() {
    this.setData({ showPhoneForm: !this.data.showPhoneForm });
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },

  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },
  onSmsInput(e) { this.setData({ smsCode: e.detail.value }); },

  onGuestBrowse() {
    this.afterLogin(true);
  },

  afterLogin(isGuest) {
    const { redirectUrl } = this.data;
    if (redirectUrl) {
      wx.redirectTo({ url: decodeURIComponent(redirectUrl) });
    } else {
      wx.switchTab({ url: '/pages/mine/mine' });
    }
  }
});
