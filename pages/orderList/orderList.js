Page({
  data: {
    activeTab: 'all',
    currentTabLabel: '全部',
    loading: false,
    noMore: false,
    page: 1,
    statusTabs: [
      { key: 'all', label: '全部', count: 0 },
      { key: 'pending_pay', label: '待付款', count: 1 },
      { key: 'pending_quote', label: '待报价', count: 0 },
      { key: 'producing', label: '制作中', count: 0 },
      { key: 'shipping', label: '待收货', count: 2 },
      { key: 'completed', label: '已完成', count: 0 },
    ],
    orders: []
  },

  onLoad(options) {
    if (options.status) this.setData({ activeTab: options.status });
    this.loadOrders();
  },

  loadOrders() {
    this.setData({ loading: true });
    // 云函数调用示例
    // wx.cloud.callFunction({ name: 'orderManager', data: { action: 'list', status: this.data.activeTab } })
    //   .then(res => this.setData({ orders: this.formatOrders(res.result.data), loading: false }));

    const mock = [
      {
        id: 'ord001', orderNo: 'ART20240501001',
        status: 'pending_pay', statusLabel: '待付款', statusClass: 'pending',
        createTime: '2024-05-01 14:23',
        totalPrice: 246,
        goods: [
          { id: 'g1', name: '纸袋造型笔筒', image: 'https://picsum.photos/140/140?random=50', spec: '奶白色 / 18cm*12cm', price: 48, quantity: 1 },
          { id: 'g2', name: '香氛蜡烛·晨雾', image: 'https://picsum.photos/140/140?random=51', spec: '米色 / 圆形', price: 198, quantity: 1 },
        ]
      },
      {
        id: 'ord002', orderNo: 'ART20240428003',
        status: 'shipping', statusLabel: '待收货', statusClass: 'shipping',
        createTime: '2024-04-28 09:11',
        totalPrice: 168,
        goods: [
          { id: 'g3', name: '几何小猫摆件', image: 'https://picsum.photos/140/140?random=52', spec: '哑白色 / 标准款', price: 168, quantity: 1 },
        ]
      },
      {
        id: 'ord003', orderNo: 'ART20240420007',
        status: 'completed', statusLabel: '已完成', statusClass: 'done',
        createTime: '2024-04-20 16:45',
        totalPrice: 380,
        goods: [
          { id: 'g4', name: '3D打印来图定制', image: 'https://picsum.photos/140/140?random=53', spec: '来图定制 / PLA', price: 380, quantity: 1 },
        ]
      },
      {
        id: 'ord004', orderNo: 'ART20240415002',
        status: 'pending_quote', statusLabel: '待报价', statusClass: 'processing',
        createTime: '2024-04-15 11:30',
        totalPrice: 0,
        goods: [
          { id: 'g5', name: '定制拼豆像素画', image: 'https://picsum.photos/140/140?random=54', spec: '提交图片待报价', price: 0, quantity: 1 },
        ]
      },
    ];

    const filtered = this.data.activeTab === 'all' ? mock : mock.filter(o => o.status === this.data.activeTab);
    setTimeout(() => this.setData({ orders: filtered, loading: false }), 300);
  },

  onTabTap(e) {
    const key = e.currentTarget.dataset.key;
    const tab = this.data.statusTabs.find(t => t.key === key);
    this.setData({ activeTab: key, currentTabLabel: tab?.label || '全部', page: 1, noMore: false });
    this.loadOrders();
  },

  onLoadMore() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ noMore: true });
  },

  goOrderDetail(e) {
    wx.navigateTo({ url: `/pages/merchant/orderDetail/orderDetail?id=${e.currentTarget.dataset.id}&isUser=true` });
  },

  onCancel(e) {
    wx.showModal({
      title: '取消订单', content: '确认取消该订单？',
      success: res => {
        if (res.confirm) {
          const orders = this.data.orders.filter(o => o.id !== e.currentTarget.dataset.id);
          this.setData({ orders });
          wx.showToast({ title: '已取消', icon: 'success' });
        }
      }
    });
  },

  onPay(e) {
    wx.showToast({ title: '微信支付接入中', icon: 'none' });
  },

  onReview(e) {
    wx.showToast({ title: '评价功能开发中', icon: 'none' });
  },

  onRebuy(e) {
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },

  onTrack(e) {
    wx.showModal({ title: '物流信息', content: '顺丰快递\n运单号：SF1234567890\n当前状态：派送中', showCancel: false });
  },

  onConfirmReceive(e) {
    wx.showModal({
      title: '确认收货', content: '确认已收到商品？',
      success: res => {
        if (res.confirm) {
          const orders = this.data.orders.map(o =>
            o.id === e.currentTarget.dataset.id
              ? { ...o, status: 'completed', statusLabel: '已完成', statusClass: 'done' }
              : o
          );
          this.setData({ orders });
          wx.showToast({ title: '已确认收货', icon: 'success' });
        }
      }
    });
  },

  contactService() {
    wx.showToast({ title: '请联系客服微信：artfulliving', icon: 'none', duration: 2000 });
  },

  goShopping() {
    wx.switchTab({ url: '/pages/home/home' });
  }
});
