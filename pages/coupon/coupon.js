Page({
  data: {
    tab: 'available',
    currentList: [],
    available: [
      { id: 'c1', name: '新人优惠券', amount: 20, minOrder: 99, scope: '全场通用', expire: '有效期至 2024-12-31' },
      { id: 'c2', name: '定制专享券', amount: 50, minOrder: 299, scope: '定制商品', expire: '有效期至 2024-11-30' },
      { id: 'c3', name: '节日满减券', amount: 30, minOrder: 199, scope: '全场通用', expire: '有效期至 2024-10-31' },
    ],
    used: [
      { id: 'c4', name: '双十一特惠', amount: 88, minOrder: 399, scope: '全场通用', expire: '已于 2023-11-12 使用', disabled: true },
    ],
    expired: [
      { id: 'c5', name: '春节专属', amount: 15, minOrder: 88, scope: '全场通用', expire: '已于 2024-02-28 过期', disabled: true },
    ]
  },

  onLoad() {
    this.setData({ currentList: this.data.available });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ tab, currentList: this.data[tab] });
  },

  useCoupon(e) {
    wx.switchTab({ url: '/pages/home/home' });
  }
});
