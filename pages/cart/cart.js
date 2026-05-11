Page({
  data: {
    isEditing: false,
    cartItems: [],
    recommendProducts: [
      { id: 'r1', name: '双口造型花瓶', image: 'https://picsum.photos/260/260?random=40', spec: '奶白色 / 20cm', price: 128 },
      { id: 'r2', name: '蘑菇台灯', image: 'https://picsum.photos/260/260?random=41', spec: '奶油色 / 触控调光', price: 268 },
      { id: 'r3', name: '几何小猫摆件', image: 'https://picsum.photos/260/260?random=42', spec: '哑光白 / 标准款', price: 168 }
    ],
    totalPrice: 0,
    selectedCount: 0,
    allSelected: false
  },

  onShow() {
    this.loadCart();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
      this.getTabBar().updateCartCount();
    }
  },

  loadCart() {
    const rawCart = wx.getStorageSync('cart') || [];
    const cartItems = rawCart.map(item => ({ ...item, selected: true }));
    this.setData({ cartItems });
    this.calcTotal();
  },

  calcTotal() {
    const { cartItems } = this.data;
    const selected = cartItems.filter(i => i.selected);
    const totalPrice = selected.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const selectedCount = selected.reduce((sum, i) => sum + i.quantity, 0);
    const allSelected = cartItems.length > 0 && selected.length === cartItems.length;
    this.setData({ totalPrice, selectedCount, allSelected });
  },

  onItemCheck(e) {
    const id = e.currentTarget.dataset.id;
    const cartItems = this.data.cartItems.map(i =>
      i.id === id ? { ...i, selected: !i.selected } : i
    );
    this.setData({ cartItems });
    this.calcTotal();
  },

  onSelectAll() {
    const allSelected = !this.data.allSelected;
    const cartItems = this.data.cartItems.map(i => ({ ...i, selected: allSelected }));
    this.setData({ cartItems, allSelected });
    this.calcTotal();
  },

  onIncrease(e) {
    const id = e.currentTarget.dataset.id;
    const cartItems = this.data.cartItems.map(i =>
      i.id === id ? { ...i, quantity: i.quantity + 1 } : i
    );
    this.setData({ cartItems });
    this.saveCart();
    this.calcTotal();
  },

  onDecrease(e) {
    const id = e.currentTarget.dataset.id;
    const cartItems = this.data.cartItems.map(i => {
      if (i.id === id) {
        if (i.quantity <= 1) return null;
        return { ...i, quantity: i.quantity - 1 };
      }
      return i;
    }).filter(Boolean);
    this.setData({ cartItems });
    this.saveCart();
    this.calcTotal();
  },

  saveCart() {
    wx.setStorageSync('cart', this.data.cartItems);
    getApp().updateCartCount();
  },

  onEdit() {
    this.setData({ isEditing: !this.data.isEditing });
  },

  onCheckout() {
    if (!this.data.selectedCount) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    // 预留微信支付接口
    wx.showModal({
      title: '去结算',
      content: `共 ${this.data.selectedCount} 件商品，合计 ¥${this.data.totalPrice}，确认去结算？`,
      confirmText: '去支付',
      success: (res) => {
        if (res.confirm) {
          // 接入微信支付
          // wx.requestPayment({ ... })
          wx.showToast({ title: '支付功能开发中', icon: 'none' });
        }
      }
    });
  },

  goShopping() {
    wx.switchTab({ url: '/pages/home/home' });
  },

  goProductDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/productDetail/productDetail?id=${id}` });
  },

  addRecommendToCart(e) {
    const id = e.currentTarget.dataset.id;
    const product = this.data.recommendProducts.find(p => p.id === id);
    if (!product) return;
    const cartItems = [...this.data.cartItems];
    const existing = cartItems.find(i => i.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ ...product, selected: true, quantity: 1 });
    }
    this.setData({ cartItems });
    this.saveCart();
    this.calcTotal();
    wx.showToast({ title: '已加入购物车', icon: 'success', duration: 1000 });
  }
});
