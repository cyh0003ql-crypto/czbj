Component({
  data: {
    selected: 0,
    color: '#999999',
    selectedColor: '#3d2a1e',
    list: [
      { pagePath: '/pages/home/home', text: '首页', icon: '⌂', iconSelected: '⌂' },
      { pagePath: '/pages/category/category', text: '分类', icon: '⊞', iconSelected: '⊞' },
      { pagePath: '/pages/customize/customize', text: '定制', icon: '+', iconSelected: '+', isCenter: true },
      { pagePath: '/pages/cart/cart', text: '购物车', icon: '🛒', iconSelected: '🛒' },
      { pagePath: '/pages/mine/mine', text: '我的', icon: '○', iconSelected: '●' }
    ],
    cartCount: 0
  },

  lifetimes: {
    attached() {
      this.updateCartCount();
    }
  },

  pageLifetimes: {
    show() {
      this.updateCartCount();
      try {
        const pages = getCurrentPages();
        if (!pages || !pages.length) return;
        const currentPage = pages[pages.length - 1];
        if (!currentPage || !currentPage.route) return;
        const route = '/' + currentPage.route;
        const list = this.data.list;
        const index = list.findIndex(item => item.pagePath === route);
        if (index !== -1) {
          this.setData({ selected: index });
        }
      } catch (e) {
        // ignore route detection errors on startup
      }
    }
  },

  methods: {
    updateCartCount() {
      try {
        const cart = wx.getStorageSync('cart') || [];
        const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        this.setData({ cartCount: count });
      } catch (e) {
        this.setData({ cartCount: 0 });
      }
    },

    switchTab(e) {
      const { index, path } = e.currentTarget.dataset;
      wx.switchTab({ url: path });
      this.setData({ selected: index });
    }
  }
});
