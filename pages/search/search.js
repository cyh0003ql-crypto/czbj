const ALL_PRODUCTS = [
  { id: '1', name: '波浪纸巾盒', image: 'https://picsum.photos/160/160?random=10', tags: ['可定制', '家居装饰'], price: 128 },
  { id: '2', name: '几何小猫摆件', image: 'https://picsum.photos/160/160?random=11', tags: ['可定制', '桌面装饰'], price: 168 },
  { id: '3', name: '北欧风台灯', image: 'https://picsum.photos/160/160?random=12', tags: ['可定制', '氛围灯'], price: 248 },
  { id: '4', name: '纸袋造型笔筒', image: 'https://picsum.photos/160/160?random=13', tags: ['可定制', '可改色'], price: 48 },
  { id: '5', name: '折纸花瓶', image: 'https://picsum.photos/160/160?random=14', tags: ['可定制', '花器'], price: 198 },
  { id: '6', name: '香氛蜡烛·晨雾', image: 'https://picsum.photos/160/160?random=15', tags: ['定制包装'], price: 198 },
  { id: '7', name: '双口造型花瓶', image: 'https://picsum.photos/160/160?random=16', tags: ['可定制'], price: 128 },
  { id: '8', name: '蘑菇台灯', image: 'https://picsum.photos/160/160?random=17', tags: ['可定制', '氛围灯'], price: 268 },
  { id: '9', name: '3D打印人像', image: 'https://picsum.photos/160/160?random=18', tags: ['来图定制', '人像'], price: 380 },
  { id: '10', name: '拼豆像素画', image: 'https://picsum.photos/160/160?random=19', tags: ['拼豆定制', '礼物'], price: 88 },
];

Page({
  data: {
    keyword: '',
    results: [],
    searching: false,
    searched: false,
    hotKeywords: ['3D打印', '来图定制', '拼豆', '笔筒', '花瓶', '台灯', '摆件', '企业礼品'],
    searchHistory: []
  },

  onLoad(options) {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({ searchHistory: history });
    if (options.kw) {
      this.setData({ keyword: options.kw });
      this.doSearch(options.kw);
    }
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value });
    if (!e.detail.value) {
      this.setData({ results: [], searched: false });
    }
  },

  onSearch() {
    this.doSearch(this.data.keyword);
  },

  onHotTap(e) {
    const kw = e.currentTarget.dataset.kw;
    this.setData({ keyword: kw });
    this.doSearch(kw);
  },

  doSearch(kw) {
    if (!kw.trim()) return;
    this.setData({ searching: true, results: [], searched: false });

    // 保存历史
    let history = wx.getStorageSync('searchHistory') || [];
    history = [kw, ...history.filter(h => h !== kw)].slice(0, 10);
    wx.setStorageSync('searchHistory', history);
    this.setData({ searchHistory: history });

    // 云函数调用示例
    // wx.cloud.callFunction({ name: 'productManager', data: { action: 'search', keyword: kw } })
    //   .then(res => this.setData({ results: res.result.data, searching: false, searched: true }));

    // 本地模拟搜索
    setTimeout(() => {
      const results = ALL_PRODUCTS.filter(p =>
        p.name.includes(kw) || p.tags.some(t => t.includes(kw))
      );
      this.setData({ results, searching: false, searched: true });
    }, 400);
  },

  clearKeyword() {
    this.setData({ keyword: '', results: [], searched: false });
  },

  clearHistory() {
    wx.setStorageSync('searchHistory', []);
    this.setData({ searchHistory: [] });
  },

  goProductDetail(e) {
    wx.navigateTo({ url: `/pages/productDetail/productDetail?id=${e.currentTarget.dataset.id}` });
  },

  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    const product = ALL_PRODUCTS.find(p => p.id === id);
    if (!product) return;
    const cart = wx.getStorageSync('cart') || [];
    const ex = cart.find(i => i.id === id);
    if (ex) ex.quantity += 1;
    else cart.push({ ...product, quantity: 1, spec: '默认规格' });
    wx.setStorageSync('cart', cart);
    wx.showToast({ title: '已加入购物车', icon: 'success', duration: 900 });
  },

  goBack() {
    wx.navigateBack();
  }
});
