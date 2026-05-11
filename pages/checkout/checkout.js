const app = getApp();

Page({
  data: {
    orderItems: [],
    selectedAddress: null,
    selectedCoupon: null,
    availableCoupons: [
      { id: 'c1', name: '新人优惠券', amount: 20, minOrder: 99, scope: '全场通用', expire: '有效期至 2024-12-31' },
      { id: 'c2', name: '定制专享券', amount: 50, minOrder: 299, scope: '定制商品', expire: '有效期至 2024-11-30' },
      { id: 'c3', name: '节日满减券', amount: 30, minOrder: 199, scope: '全场通用', expire: '有效期至 2024-10-31' },
    ],
    remark: '',
    payMethod: 'wechat',
    subtotal: 0,
    shippingFee: 0,
    finalTotal: 0,
    showCouponPanel: false,
    submitting: false,
    paySuccess: false,
    orderNo: '',
  },

  onLoad(options) {
    let items = [];
    if (options.items) {
      try { items = JSON.parse(decodeURIComponent(options.items)); } catch (e) {}
    }
    if (!items.length) {
      const cart = wx.getStorageSync('cart') || [];
      items = cart.filter(i => i.selected !== false);
    }

    const addresses = wx.getStorageSync('addresses') || [
      { id: 'a1', name: '张小艺', phone: '138****8888', province: '广东省', city: '深圳市', district: '南山区', detail: '科技园路1号101室', isDefault: true }
    ];
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0] || null;

    this.setData({ orderItems: items, selectedAddress: defaultAddr });
    this.calcPrice();
  },

  calcPrice() {
    const subtotal = this.data.orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 99 ? 0 : 12;
    const discount = this.data.selectedCoupon ? Math.min(this.data.selectedCoupon.amount, subtotal) : 0;
    const finalTotal = Math.max(0, subtotal + shippingFee - discount);
    this.setData({ subtotal, shippingFee, finalTotal });
  },

  changeAddress() {
    wx.navigateTo({ url: '/pages/address/address' });
  },

  onShow() {
    const selectedAddress = app.globalData.selectedAddress;
    if (selectedAddress) {
      this.setData({ selectedAddress });
      app.globalData.selectedAddress = null;
    }
    // Also check addresses storage
    const addresses = wx.getStorageSync('addresses');
    if (addresses && addresses.length && !this.data.selectedAddress) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      this.setData({ selectedAddress: defaultAddr });
    }
  },

  openCouponPanel() {
    this.setData({ showCouponPanel: true });
  },

  closeCouponPanel() {
    this.setData({ showCouponPanel: false });
  },

  onSelectCoupon(e) {
    const coupon = this.data.availableCoupons[e.currentTarget.dataset.index];
    if (this.data.subtotal < coupon.minOrder) {
      wx.showToast({ title: `满${coupon.minOrder}元才可使用`, icon: 'none' }); return;
    }
    const isSame = this.data.selectedCoupon && this.data.selectedCoupon.id === coupon.id;
    this.setData({ selectedCoupon: isSame ? null : coupon });
    this.calcPrice();
  },

  selectNoCoupon() {
    this.setData({ selectedCoupon: null });
    this.calcPrice();
  },

  selectPayMethod(e) {
    this.setData({ payMethod: e.currentTarget.dataset.method });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  onSubmitOrder() {
    if (!this.data.selectedAddress) {
      wx.showToast({ title: '请先选择收货地址', icon: 'none' }); return;
    }
    if (!app.globalData.isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' }); return;
    }
    if (this.data.submitting) return;

    this.setData({ submitting: true });
    wx.showLoading({ title: '提交订单...', mask: true });

    const orderData = {
      items: this.data.orderItems,
      address: this.data.selectedAddress,
      coupon: this.data.selectedCoupon,
      remark: this.data.remark,
      subtotal: this.data.subtotal,
      shippingFee: this.data.shippingFee,
      discount: this.data.selectedCoupon ? this.data.selectedCoupon.amount : 0,
      totalPrice: this.data.finalTotal,
      payMethod: this.data.payMethod,
      status: 'pending_pay',
      createTime: new Date().toLocaleString('zh-CN'),
    };

    // 云函数调用示例
    // wx.cloud.callFunction({ name: 'orderManager', data: { action: 'create', order: orderData } })
    //   .then(res => { ... });

    // 模拟下单成功 → 触发微信支付
    setTimeout(() => {
      wx.hideLoading();
      const orderNo = 'ART' + Date.now().toString().slice(-10);
      // 真实支付：wx.requestPayment({ ... })
      // 这里模拟支付成功
      const orders = wx.getStorageSync('myOrders') || [];
      orders.unshift({ ...orderData, orderNo, id: orderNo });
      wx.setStorageSync('myOrders', orders);

      // 清空已结算的购物车商品
      const cart = wx.getStorageSync('cart') || [];
      const itemKeys = this.data.orderItems.map(i => i.cartKey || i.id);
      const newCart = cart.filter(c => !itemKeys.includes(c.cartKey || c.id));
      wx.setStorageSync('cart', newCart);
      app.updateCartCount();

      this.setData({ submitting: false, paySuccess: true, orderNo });
    }, 1500);
  },

  goOrderList() {
    this.setData({ paySuccess: false });
    wx.redirectTo({ url: '/pages/orderList/orderList' });
  },

  goHome() {
    this.setData({ paySuccess: false });
    wx.switchTab({ url: '/pages/home/home' });
  }
});
