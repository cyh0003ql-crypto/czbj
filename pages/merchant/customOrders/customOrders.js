Page({
  data: {
    activeTab: 'all',
    loading: false,
    noMore: false,
    tabs: [
      { key: 'all', label: '全部', count: 0 },
      { key: 'pending_quote', label: '待报价', count: 12 },
      { key: 'quoting', label: '已报价', count: 3 },
      { key: 'producing', label: '制作中', count: 8 },
      { key: 'completed', label: '已完成', count: 0 },
    ],
    allOrders: [
      { id: 'co1', status: 'pending_quote', statusLabel: '待报价', statusClass: 'pending', userName: '张小艺', userAvatar: 'https://picsum.photos/64/64?random=80', createTime: '2024-05-01 14:23', textDesc: '想定制一个麦当劳纸袋造型的笔筒，颜色选奶白色，高度大约18cm，材质希望用PLA哑光', files: [{ path: 'https://picsum.photos/120/120?random=81', type: 'image' }, { path: 'https://picsum.photos/120/120?random=82', type: 'image' }], size: { l: '18', w: '12', h: '18', note: '' }, quote: null },
      { id: 'co2', status: 'quoting', statusLabel: '已报价', statusClass: 'processing', userName: '李设计', userAvatar: 'https://picsum.photos/64/64?random=83', createTime: '2024-04-30 09:11', textDesc: '需要一个3D打印的猫咪摆件，要可爱风格，纯白色，约20cm高', files: [{ path: 'https://picsum.photos/120/120?random=84', type: 'image' }], size: { l: '', w: '', h: '20', note: '' }, quote: '280' },
      { id: 'co3', status: 'producing', statusLabel: '制作中', statusClass: 'producing', userName: '王创意', userAvatar: 'https://picsum.photos/64/64?random=85', createTime: '2024-04-28 16:00', textDesc: '公司企业定制，需要50个印有LOGO的笔筒，尺寸统一18*12cm', files: [], size: { l: '18', w: '12', h: '18', note: '×50个' }, quote: '2400' },
      { id: 'co4', status: 'pending_quote', statusLabel: '待报价', statusClass: 'pending', userName: '陈艺术', userAvatar: 'https://picsum.photos/64/64?random=86', createTime: '2024-04-27 11:30', textDesc: '来图定制一个人像，大约30cm高，要有精细面部特征', files: [{ path: 'https://picsum.photos/120/120?random=87', type: 'image' }, { path: 'https://picsum.photos/120/120?random=88', type: 'image' }, { path: 'https://picsum.photos/120/120?random=89', type: 'image' }, { path: 'https://picsum.photos/120/120?random=90', type: 'image' }], size: { l: '', w: '', h: '30', note: '' }, quote: null },
    ],
    orders: []
  },

  onLoad(options) {
    if (options.status) this.setData({ activeTab: options.status });
    this.filterOrders();
  },

  filterOrders() {
    const { activeTab, allOrders } = this.data;
    const orders = activeTab === 'all' ? allOrders : allOrders.filter(o => o.status === activeTab);
    this.setData({ orders });
  },

  onTabTap(e) {
    this.setData({ activeTab: e.currentTarget.dataset.key });
    this.filterOrders();
  },

  onLoadMore() {
    this.setData({ noMore: true });
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/merchant/orderDetail/orderDetail?id=${e.currentTarget.dataset.id}` });
  },

  contactUser(e) {
    wx.showToast({ title: '联系买家功能开发中', icon: 'none' });
  },

  quickQuote(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '快速报价',
      editable: true,
      placeholderText: '输入报价金额（元）',
      success: res => {
        if (res.confirm && res.content) {
          const orders = this.data.allOrders.map(o =>
            o.id === id ? { ...o, status: 'quoting', statusLabel: '已报价', statusClass: 'processing', quote: res.content } : o
          );
          this.setData({ allOrders: orders });
          this.filterOrders();
          wx.showToast({ title: `报价 ¥${res.content} 已发送`, icon: 'success' });
        }
      }
    });
  },

  startProduce(e) {
    const id = e.currentTarget.dataset.id;
    const orders = this.data.allOrders.map(o =>
      o.id === id ? { ...o, status: 'producing', statusLabel: '制作中', statusClass: 'producing' } : o
    );
    this.setData({ allOrders: orders });
    this.filterOrders();
    wx.showToast({ title: '已开始制作', icon: 'success' });
  },

  shipOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认发货',
      editable: true,
      placeholderText: '输入快递单号',
      success: res => {
        if (res.confirm && res.content) {
          const orders = this.data.allOrders.map(o =>
            o.id === id ? { ...o, status: 'completed', statusLabel: '已完成', statusClass: 'done' } : o
          );
          this.setData({ allOrders: orders });
          this.filterOrders();
          wx.showToast({ title: '发货成功', icon: 'success' });
        }
      }
    });
  }
});
