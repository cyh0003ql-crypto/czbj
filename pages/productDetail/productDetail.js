const app = getApp();

Page({
  data: {
    statusBarHeight: 0,
    productId: '',
    activeTab: 0,
    currentImageIndex: 0,
    isWished: false,
    showSpecPanel: false,
    selectedColor: '',
    selectedSize: '',
    selectedSpec: '',
    selectedSpecPrice: 0,
    selectedSpecStock: 0,
    quantity: 1,
    specAction: 'cart', // 'cart' or 'buy'
    colorOptions: [
      { value: 'white', label: '奶白色', hex: '#f5f0e8', price: 48, stock: 10 },
      { value: 'gray', label: '哑光灰', hex: '#9a9a9a', price: 48, stock: 5 },
      { value: 'black', label: '纯黑色', hex: '#2c2c2c', price: 48, stock: 8 },
      { value: 'custom', label: '自定义', hex: '#c9a882', price: 68, stock: 99 },
    ],
    sizeOptions: [
      { value: 'small', label: '小号 12cm×8cm', stock: 10 },
      { value: 'standard', label: '标准 18cm×12cm', stock: 8 },
      { value: 'large', label: '大号 24cm×16cm', stock: 3 },
    ],
    product: {
      id: '1',
      name: '纸袋造型笔筒',
      price: 48,
      originalPrice: 68,
      images: [
        'https://picsum.photos/600/600?random=50',
        'https://picsum.photos/600/600?random=51',
        'https://picsum.photos/600/600?random=52',
        'https://picsum.photos/600/600?random=53',
        'https://picsum.photos/600/600?random=54'
      ],
      detailImages: [
        'https://picsum.photos/700/500?random=55',
        'https://picsum.photos/700/500?random=56'
      ],
      tags: ['可定制', '可改色', '3天发货'],
      description: '以麦当劳经典纸袋为灵感，运用FDM 3D打印技术还原了纸袋的褶皱质感与立体结构。PLA哑光材质，质感细腻，摆放在桌面上既实用又兼具艺术感。\n\n支持定制颜色和尺寸，也可为品牌/活动制作专属联名款。每件产品均为独立打印，制作周期3-7个工作日。',
      specs: [
        { label: '材质', value: 'PLA哑光' },
        { label: '工艺', value: 'FDM 3D打印' },
        { label: '尺寸', value: '18cm × 12cm（可定制）' },
        { label: '重量', value: '约 0.23 kg' },
        { label: '颜色', value: '奶白 / 灰色 / 黑色 / 可定制' },
        { label: '表面处理', value: '原色 / 打磨 / 喷漆（可选）' },
        { label: '发货时间', value: '现货3天内 / 定制3-7天' },
        { label: '适用场景', value: '桌面收纳 / 办公装饰 / 礼品赠送' }
      ]
    },
    customSteps: [
      { step: 1, icon: '🖼', title: '提交需求', desc: '在定制页上传图片/模型，填写需求描述' },
      { step: 2, icon: '💬', title: '评估报价', desc: '专业团队评估，24小时内确认方案报价' },
      { step: 3, icon: '✅', title: '确认下单', desc: '确认定制方案，完成支付后开始制作' },
      { step: 4, icon: '🚚', title: '制作发货', desc: '精心3D打印制作，妥善包装极速发货' }
    ],
    reviews: [
      {
        id: 1, name: 'Z**n', avatar: 'https://picsum.photos/60/60?random=60',
        spec: '奶白色 / 标准 18cm×12cm', date: '2024-04-15',
        content: '质感超好！摸起来细腻，放在桌上特别有设计感，同事都在问是哪里买的。包装也很用心，送礼不错！',
        images: ['https://picsum.photos/140/140?random=61', 'https://picsum.photos/140/140?random=62']
      },
      {
        id: 2, name: 'L**a', avatar: 'https://picsum.photos/60/60?random=63',
        spec: '哑光灰 / 大号 24cm×16cm', date: '2024-03-28',
        content: '定制了带LOGO的版本作为员工礼品，50个都完美。效果非常满意，商家沟通很耐心，下次还会来！',
        images: []
      },
      {
        id: 3, name: 'A**i', avatar: 'https://picsum.photos/60/60?random=64',
        spec: '纯黑色 / 小号 12cm×8cm', date: '2024-03-10',
        content: '买了三个放桌上当摆件，细节处理很棒，和图片一样好看。快递包装很安全，没有磕碰。',
        images: ['https://picsum.photos/140/140?random=65']
      }
    ]
  },

  onLoad(options) {
    const info = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: info.statusBarHeight, productId: options.id || '1' });
    this.loadProduct(options.id);
    // 检查是否收藏过
    const wishlist = wx.getStorageSync('wishlist') || [];
    this.setData({ isWished: !!wishlist.find(w => w.id === (options.id || '1')) });
  },

  loadProduct(id) {
    // 云函数调用示例
    // wx.cloud.callFunction({ name: 'productManager', data: { action: 'getById', id } })
    //   .then(res => this.setData({ product: res.result.data }));
  },

  onSwiperChange(e) {
    this.setData({ currentImageIndex: e.detail.current });
  },

  onTabTap(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index });
  },

  // 规格面板
  openSpecPanel() {
    this.setData({ showSpecPanel: true, specAction: 'cart' });
  },

  closeSpecPanel() {
    this.setData({ showSpecPanel: false });
  },

  onSelectColor(e) {
    const { value, price } = e.currentTarget.dataset;
    this.setData({ selectedColor: value, selectedSpecPrice: price });
    this.updateSelectedSpec();
  },

  onSelectSize(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ selectedSize: value });
    this.updateSelectedSpec();
  },

  updateSelectedSpec() {
    const { selectedColor, selectedSize, colorOptions, sizeOptions } = this.data;
    const c = colorOptions.find(o => o.value === selectedColor);
    const s = sizeOptions.find(o => o.value === selectedSize);
    if (c && s) {
      this.setData({
        selectedSpec: `${c.label} / ${s.label}`,
        selectedSpecPrice: c.price,
        selectedSpecStock: Math.min(c.stock, s.stock)
      });
    } else if (c) {
      this.setData({ selectedSpec: c.label, selectedSpecPrice: c.price });
    }
  },

  decreaseQty() {
    if (this.data.quantity <= 1) return;
    this.setData({ quantity: this.data.quantity - 1 });
  },

  increaseQty() {
    const max = this.data.selectedSpecStock || 99;
    if (this.data.quantity >= max) {
      wx.showToast({ title: '已达库存上限', icon: 'none' });
      return;
    }
    this.setData({ quantity: this.data.quantity + 1 });
  },

  confirmAddToCart() {
    if (!this.data.selectedSpec) {
      wx.showToast({ title: '请选择规格', icon: 'none' }); return;
    }
    this._addToCart();
    this.setData({ showSpecPanel: false });
  },

  confirmBuyNow() {
    if (!this.data.selectedSpec) {
      wx.showToast({ title: '请选择规格', icon: 'none' }); return;
    }
    this._addToCart();
    this.setData({ showSpecPanel: false });
    setTimeout(() => this._buyNow(), 300);
  },

  _addToCart() {
    const { product, selectedSpec, selectedSpecPrice, quantity } = this.data;
    const cart = wx.getStorageSync('cart') || [];
    const key = `${product.id}_${selectedSpec}`;
    const existing = cart.find(i => i.cartKey === key);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        cartKey: key, id: product.id, name: product.name,
        image: product.images[0], spec: selectedSpec,
        price: selectedSpecPrice || product.price, quantity
      });
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({ title: '已加入购物车', icon: 'success', duration: 900 });
  },

  _buyNow() {
    wx.showModal({
      title: '立即购买',
      content: '请先完善收货地址，支付功能接入中',
      confirmText: '去填写地址',
      success: res => {
        if (res.confirm) wx.navigateTo({ url: '/pages/address/address' });
      }
    });
  },

  addToCart() {
    this.setData({ showSpecPanel: true, specAction: 'cart' });
  },

  buyNow() {
    this.setData({ showSpecPanel: true, specAction: 'buy' });
  },

  onWishlist() {
    const isWished = !this.data.isWished;
    this.setData({ isWished });
    const wishlist = wx.getStorageSync('wishlist') || [];
    const { product } = this.data;
    if (isWished) {
      if (!wishlist.find(w => w.id === product.id)) {
        wishlist.push({ id: product.id, name: product.name, image: product.images[0], tags: product.tags, price: product.price });
      }
    } else {
      const idx = wishlist.findIndex(w => w.id === product.id);
      if (idx > -1) wishlist.splice(idx, 1);
    }
    wx.setStorageSync('wishlist', wishlist);
    wx.showToast({ title: isWished ? '已加入收藏' : '已取消收藏', icon: isWished ? 'success' : 'none', duration: 900 });
  },

  onShare() { wx.showShareMenu({ withShareTicket: true }); },

  contactService() {
    wx.showModal({
      title: '联系客服', content: '客服微信：artfulliving\n工作时间：周一至周六 9:00-21:00', showCancel: false
    });
  },

  goBack() { wx.navigateBack(); },

  onShareAppMessage() {
    return { title: this.data.product.name, path: `/pages/productDetail/productDetail?id=${this.data.productId}` };
  }
});
