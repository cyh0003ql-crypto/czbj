Page({
  data: {
    items: [
      { id: '2', name: '几何小猫摆件', image: 'https://picsum.photos/300/300?random=11', tags: ['可定制', '桌面装饰'], price: 168 },
      { id: '3', name: '北欧风台灯', image: 'https://picsum.photos/300/300?random=12', tags: ['可定制', '氛围灯'], price: 248 },
      { id: '7', name: '双口造型花瓶', image: 'https://picsum.photos/300/300?random=16', tags: ['可定制'], price: 128 },
      { id: '8', name: '蘑菇台灯', image: 'https://picsum.photos/300/300?random=17', tags: ['可定制', '氛围灯'], price: 268 },
    ]
  },

  onLoad() {
    const wishlist = wx.getStorageSync('wishlist') || [];
    if (wishlist.length) this.setData({ items: wishlist });
  },

  removeWishlist(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消收藏', content: '确认取消收藏该商品？',
      success: res => {
        if (res.confirm) {
          const items = this.data.items.filter(i => i.id !== id);
          this.setData({ items });
          const wishlist = wx.getStorageSync('wishlist') || [];
          wx.setStorageSync('wishlist', wishlist.filter(i => i.id !== id));
          wx.showToast({ title: '已取消收藏', icon: 'success', duration: 900 });
        }
      }
    });
  },

  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.items.find(i => i.id === id);
    if (!item) return;
    const cart = wx.getStorageSync('cart') || [];
    const ex = cart.find(c => c.id === id);
    if (ex) ex.quantity += 1;
    else cart.push({ ...item, quantity: 1, spec: '默认规格' });
    wx.setStorageSync('cart', cart);
    wx.showToast({ title: '已加入购物车', icon: 'success', duration: 900 });
  },

  goProductDetail(e) {
    wx.navigateTo({ url: `/pages/productDetail/productDetail?id=${e.currentTarget.dataset.id}` });
  },

  goShopping() {
    wx.switchTab({ url: '/pages/home/home' });
  }
});
