const app = getApp();

Page({
  data: {
    statusBarHeight: 0,
    banners: [
      { id: 1, title: '把你的想法\n打印出来', desc: '3D打印 · 拼豆定制 · 创意实现', img: 'https://picsum.photos/400/320?random=1', bg: '#ede0d0' },
      { id: 2, title: '来图定制\n独一无二', desc: '上传图片 / 模型 即刻获取报价', img: 'https://picsum.photos/400/320?random=2', bg: '#e8ddd3' },
      { id: 3, title: '精美礼物\n送给在乎的人', desc: '拼豆像素画 · 情感定制', img: 'https://picsum.photos/400/320?random=3', bg: '#f0e6d8' }
    ],
    features: [
      { id: 'custom', name: '来图定制', desc: '上传图片/模型', icon: '🖼' },
      { id: 'pixel', name: '拼豆定制', desc: '头像/礼物/像素风', icon: '⬛' },
      { id: 'print3d', name: '3D打印', desc: '精细制作/多材质', icon: '🧊' },
      { id: 'model', name: '模型打印', desc: 'STL/OBJ专业打印', icon: '🗿' }
    ],
    products: [
      { id: '1', name: '波浪纸巾盒', image: 'https://picsum.photos/300/300?random=10', tags: ['可定制', '家居装饰'], price: 128, wished: false },
      { id: '2', name: '几何小猫摆件', image: 'https://picsum.photos/300/300?random=11', tags: ['可定制', '桌面装饰'], price: 168, wished: false },
      { id: '3', name: '北欧风台灯', image: 'https://picsum.photos/300/300?random=12', tags: ['可定制', '氛围灯'], price: 248, wished: false },
      { id: '4', name: '纸袋造型笔筒', image: 'https://picsum.photos/300/300?random=13', tags: ['可定制', '可改色'], price: 48, wished: false },
      { id: '5', name: '折纸花瓶', image: 'https://picsum.photos/300/300?random=14', tags: ['可定制', '花器'], price: 198, wished: false },
      { id: '6', name: '香氛蜡烛·晨雾', image: 'https://picsum.photos/300/300?random=15', tags: ['定制包装'], price: 198, wished: false },
    ]
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight });
    this.loadProducts();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
      this.getTabBar().updateCartCount();
    }
  },

  loadProducts() {
    // 云函数调用示例
    // wx.cloud.callFunction({
    //   name: 'productManager',
    //   data: { action: 'list', page: 1, pageSize: 6, featured: true }
    // }).then(res => this.setData({ products: res.result.data }));
  },

  onSearch() {
    wx.navigateTo({ url: '/pages/search/search' });
  },

  onScan() {
    wx.scanCode({ success: res => console.log(res) });
  },

  goCustomize() {
    wx.switchTab({ url: '/pages/customize/customize' });
  },

  goCategory() {
    wx.switchTab({ url: '/pages/category/category' });
  },

  onFeatureTap(e) {
    wx.switchTab({ url: '/pages/customize/customize' });
  },

  goProductDetail(e) {
    wx.navigateTo({ url: `/pages/productDetail/productDetail?id=${e.currentTarget.dataset.id}` });
  },

  onWishlist(e) {
    const id = e.currentTarget.dataset.id;
    const products = this.data.products.map(p => p.id === id ? { ...p, wished: !p.wished } : p);
    const product = products.find(p => p.id === id);
    // 同步到收藏列表
    const wishlist = wx.getStorageSync('wishlist') || [];
    if (product.wished) {
      if (!wishlist.find(w => w.id === id)) wishlist.push(product);
    } else {
      const idx = wishlist.findIndex(w => w.id === id);
      if (idx > -1) wishlist.splice(idx, 1);
    }
    wx.setStorageSync('wishlist', wishlist);
    this.setData({ products });
    wx.showToast({ title: product.wished ? '已收藏' : '已取消收藏', icon: 'success', duration: 900 });
  },

  onShareAppMessage() {
    return { title: 'Artful Living - 3D打印定制创意生活小物', path: '/pages/home/home' };
  }
});
