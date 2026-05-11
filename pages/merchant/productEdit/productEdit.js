Page({
  data: {
    isEdit: false,
    productId: null,
    tagInput: '',
    categories: [
      { id: 'all', name: '全部' }, { id: 'custom', name: '来图定制' }, { id: 'model', name: '模型打印' },
      { id: 'desktop', name: '桌面摆件' }, { id: 'home', name: '家居装饰' }, { id: 'vase', name: '花器花瓶' },
      { id: 'handcraft', name: '手办雕塑' }, { id: 'gift', name: '企业礼品' }
    ],
    form: {
      name: '', price: '', shippingTime: '现货3天内/定制3-7天', categoryIndex: 0,
      customizable: true, featured: false, tags: [], images: [], description: '',
      specs: [
        { label: '材质', value: '' }, { label: '工艺', value: '' }, { label: '尺寸', value: '' }
      ]
    }
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ isEdit: true, productId: options.id });
      wx.setNavigationBarTitle({ title: '编辑商品' });
      this.loadProduct(options.id);
    } else {
      wx.setNavigationBarTitle({ title: '新增商品' });
    }
  },

  loadProduct(id) {
    // 云函数调用示例
    // wx.cloud.callFunction({ name: 'productManager', data: { action: 'getById', id } })
    //   .then(res => this.setData({ form: { ...this.data.form, ...res.result.data } }));
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [`form.${key}`]: e.detail.value });
  },

  onToggle(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [`form.${key}`]: e.detail.value });
  },

  onCategoryChange(e) {
    this.setData({ 'form.categoryIndex': e.detail.value });
  },

  onTagInput(e) { this.setData({ tagInput: e.detail.value }); },

  addTag() {
    const tag = this.data.tagInput.trim();
    if (!tag) return;
    if (this.data.form.tags.includes(tag)) { wx.showToast({ title: '标签已存在', icon: 'none' }); return; }
    const tags = [...this.data.form.tags, tag];
    this.setData({ 'form.tags': tags, tagInput: '' });
  },

  removeTag(e) {
    const tags = this.data.form.tags.filter((_, i) => i !== e.currentTarget.dataset.index);
    this.setData({ 'form.tags': tags });
  },

  addImage() {
    wx.chooseMedia({ count: 9 - this.data.form.images.length, mediaType: ['image'],
      success: res => {
        const images = [...this.data.form.images, ...res.tempFiles.map(f => f.tempFilePath)];
        this.setData({ 'form.images': images });
      }
    });
  },

  removeImage(e) {
    const images = this.data.form.images.filter((_, i) => i !== e.currentTarget.dataset.index);
    this.setData({ 'form.images': images });
  },

  onSpecInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const specs = [...this.data.form.specs];
    specs[index][field] = e.detail.value;
    this.setData({ 'form.specs': specs });
  },

  addSpec() {
    const specs = [...this.data.form.specs, { label: '', value: '' }];
    this.setData({ 'form.specs': specs });
  },

  removeSpec(e) {
    const specs = this.data.form.specs.filter((_, i) => i !== e.currentTarget.dataset.index);
    this.setData({ 'form.specs': specs });
  },

  saveDraft() {
    wx.setStorageSync('productDraft', this.data.form);
    wx.showToast({ title: '已保存草稿', icon: 'success' });
  },

  publishProduct() {
    const { form } = this.data;
    if (!form.name) { wx.showToast({ title: '请输入商品名称', icon: 'none' }); return; }
    if (!form.price) { wx.showToast({ title: '请输入价格', icon: 'none' }); return; }

    wx.showLoading({ title: '发布中...', mask: true });

    const productData = {
      ...form,
      category: this.data.categories[form.categoryIndex].id,
      isOnSale: true,
      createTime: new Date().toISOString()
    };

    // 云函数调用示例
    // const action = this.data.isEdit ? 'update' : 'create';
    // wx.cloud.callFunction({ name: 'productManager', data: { action, id: this.data.productId, product: productData } })
    //   .then(() => { wx.hideLoading(); wx.showToast({ title: '发布成功', icon: 'success' }); setTimeout(() => wx.navigateBack(), 1200); });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: this.data.isEdit ? '修改成功' : '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1200);
    }, 1000);
  }
});
