Page({
  data: {
    isUser: false,
    quotePrice: '',
    trackingNo: '',
    statusColor: '#6b4f3a',
    statusIcon: '📋',
    order: {},
    progressSteps: [
      { key: 'paid', label: '已下单', time: '2024-05-01 14:23' },
      { key: 'quoting', label: '评估报价', time: '2024-05-01 16:00' },
      { key: 'confirmed', label: '确认方案', time: '2024-05-02 10:00' },
      { key: 'producing', label: '制作中', time: '' },
      { key: 'shipped', label: '已发货', time: '' },
      { key: 'completed', label: '已完成', time: '' },
    ]
  },

  onLoad(options) {
    this.setData({ isUser: options.isUser === 'true' });
    this.loadOrder(options.id);
  },

  loadOrder(id) {
    // 云函数调用示例
    // wx.cloud.callFunction({ name: 'orderManager', data: { action: 'getById', id } })
    //   .then(res => this.setData({ order: this.formatOrder(res.result.data) }));

    const mockOrder = {
      id, orderNo: 'ART20240501001',
      status: 'pending_quote',
      statusLabel: '待报价',
      statusDesc: '商家正在评估您的需求，请耐心等待',
      currentStep: 1,
      customDesc: '希望制作一个麦当劳纸袋造型的笔筒，颜色选奶白色，高度大约18cm',
      customImages: ['https://picsum.photos/160/160?random=70', 'https://picsum.photos/160/160?random=71'],
      address: { name: '张小艺', phone: '138****8888', full: '广东省深圳市南山区科技园路1号101室' },
      goods: [
        { id: 'g1', name: '来图定制 - 纸袋笔筒', image: 'https://picsum.photos/140/140?random=50', spec: '来图定制 / PLA哑白', price: 0, quantity: 1 }
      ],
      subtotal: 0, shipping: 0, discount: 0, totalPrice: '待报价',
      createTime: '2024-05-01 14:23',
      payTime: null, trackingNo: null
    };
    const statusMap = {
      pending_pay: { color: '#e8a23a', icon: '💳' },
      pending_quote: { color: '#5b9bd5', icon: '📋' },
      confirmed: { color: '#8b6f5e', icon: '✅' },
      producing: { color: '#c9a882', icon: '🔨' },
      shipping: { color: '#52b788', icon: '🚚' },
      completed: { color: '#52b788', icon: '✅' },
    };
    const sc = statusMap[mockOrder.status] || { color: '#999', icon: '📋' };
    this.setData({ order: mockOrder, statusColor: sc.color, statusIcon: sc.icon });
  },

  onQuoteInput(e) { this.setData({ quotePrice: e.detail.value }); },
  onTrackingInput(e) { this.setData({ trackingNo: e.detail.value }); },

  onQuote() {
    if (!this.data.quotePrice) { wx.showToast({ title: '请输入报价', icon: 'none' }); return; }
    wx.showModal({
      title: '确认报价',
      content: `向买家报价 ¥${this.data.quotePrice}，确认发送？`,
      success: res => {
        if (res.confirm) {
          // wx.cloud.callFunction({ name: 'orderManager', data: { action: 'updateStatus', id: this.data.order.id, status: 'quoting', quote: { price: this.data.quotePrice } } })
          const order = { ...this.data.order, status: 'quoting', statusLabel: '已报价', totalPrice: this.data.quotePrice };
          this.setData({ order });
          wx.showToast({ title: '报价已发送', icon: 'success' });
        }
      }
    });
  },

  startProduction() {
    wx.showModal({
      title: '开始制作', content: '确认开始制作该订单？',
      success: res => {
        if (res.confirm) {
          const order = { ...this.data.order, status: 'producing', statusLabel: '制作中', currentStep: 3 };
          this.setData({ order });
          wx.showToast({ title: '已开始制作', icon: 'success' });
        }
      }
    });
  },

  onShip() {
    if (!this.data.trackingNo) { wx.showToast({ title: '请输入快递单号', icon: 'none' }); return; }
    wx.showModal({
      title: '确认发货', content: `快递单号：${this.data.trackingNo}，确认发货？`,
      success: res => {
        if (res.confirm) {
          // wx.cloud.callFunction({ name: 'orderManager', data: { action: 'updateShipping', id: this.data.order.id, trackingNo: this.data.trackingNo, trackingCompany: '顺丰' } })
          const order = { ...this.data.order, status: 'shipping', statusLabel: '已发货', trackingNo: this.data.trackingNo, currentStep: 4 };
          this.setData({ order });
          wx.showToast({ title: '发货成功', icon: 'success' });
        }
      }
    });
  },

  onPay() { wx.showToast({ title: '微信支付接入中', icon: 'none' }); },
  onConfirmReceive() { wx.showToast({ title: '已确认收货', icon: 'success' }); },
  contactUser() { wx.showToast({ title: '联系买家功能开发中', icon: 'none' }); },
  contactService() { wx.showToast({ title: '请联系客服微信：artfulliving', icon: 'none', duration: 2000 }); },
  cancelOrder() {
    wx.showModal({
      title: '取消订单', content: '确认取消该订单？取消后不可恢复。',
      success: res => { if (res.confirm) wx.navigateBack(); }
    });
  },

  copyTracking() {
    if (!this.data.order.trackingNo) return;
    wx.setClipboardData({ data: this.data.order.trackingNo, success: () => wx.showToast({ title: '已复制', icon: 'success' }) });
  }
});
