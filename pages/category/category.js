Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  data: {
    searchKeyword: '',
    currentCat: 'all',
    loading: false,
    noMore: false,
    page: 1,
    categories: [
      { id: 'all', name: '全部' },
      { id: 'custom', name: '来图定制' },
      { id: 'model', name: '模型打印' },
      { id: 'desktop', name: '桌面摆件' },
      { id: 'home', name: '家居装饰' },
      { id: 'vase', name: '花器花瓶' },
      { id: 'handcraft', name: '手办雕塑' },
      { id: 'gift', name: '企业礼品' }
    ],
    serviceCards: [
      {
        id: 'custom',
        name: '来图定制',
        desc: '上传图片 / 模型 / 尺寸\n立即获取报价',
        img: 'https://picsum.photos/200/150?random=20'
      },
      {
        id: 'model',
        name: '模型打印',
        desc: '支持STL/OBJ等格式\n专业打印服务',
        img: 'https://picsum.photos/200/150?random=21'
      },
      {
        id: 'desktop',
        name: '桌面摆件',
        desc: '创意设计 · 精致生活',
        img: 'https://picsum.photos/200/150?random=22'
      }
    ],
    products: [
      { id: '1', name: '几何小猫摆件', image: 'https://picsum.photos/200/200?random=30', tags: ['可定制', '桌面装饰'], price: 168, wished: false },
      { id: '2', name: '北欧风台灯', image: 'https://picsum.photos/200/200?random=31', tags: ['可定制', '氛围灯'], price: 248, wished: false },
      { id: '3', name: '波浪纸巾盒', image: 'https://picsum.photos/200/200?random=32', tags: ['可定制', '家居装饰'], price: 128, wished: false },
      { id: '4', name: '折纸花瓶', image: 'https://picsum.photos/200/200?random=33', tags: ['可定制', '花器花瓶'], price: 198, wished: false },
      { id: '5', name: '纸袋造型笔筒', image: 'https://picsum.photos/200/200?random=34', tags: ['可定制', '可改色'], price: 48, wished: false },
      { id: '6', name: '香氛蜡烛·晨雾', image: 'https://picsum.photos/200/200?random=35', tags: ['定制包装'], price: 198, wished: false }
    ]
  },

  onLoad() {
    this.loadData();
  },

  onCatTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentCat: id, page: 1, noMore: false });
    this.loadData();
  },

  loadData() {
    // 云函数调用示例
    // wx.cloud.callFunction({
    //   name: 'productManager',
    //   data: { action: 'listByCategory', category: this.data.currentCat, page: this.data.page }
    // }).then(res => this.setData({ products: res.result.data }));
  },

  onLoadMore() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ loading: true, page: this.data.page + 1 });
    setTimeout(() => {
      this.setData({ loading: false, noMore: true });
    }, 800);
  },

  onSearch() {
    wx.showToast({ title: '搜索功能', icon: 'none' });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  goCustomize() {
    wx.switchTab({ url: '/pages/customize/customize' });
  },

  goProductDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/productDetail/productDetail?id=${id}` });
  },

  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    const product = this.data.products.find(p => p.id === id);
    if (!product) return;
    const cart = wx.getStorageSync('cart') || [];
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, spec: '默认规格' });
    }
    wx.setStorageSync('cart', cart);
    getApp().updateCartCount();
    wx.showToast({ title: '已加入购物车', icon: 'success', duration: 1000 });
  },

  onWishlist(e) {
    const id = e.currentTarget.dataset.id;
    const products = this.data.products.map(p =>
      p.id === id ? { ...p, wished: !p.wished } : p
    );
    this.setData({ products });
  }
});
