Page({
  data: {
    addresses: [
      { id: 'a1', name: '张小艺', phone: '138****8888', province: '广东省', city: '深圳市', district: '南山区', detail: '科技园路1号101室', isDefault: true },
      { id: 'a2', name: '李设计', phone: '139****6666', province: '上海市', city: '上海市', district: '徐汇区', detail: '漕宝路28号', isDefault: false },
    ],
    showForm: false,
    editId: null,
    form: { name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false }
  },

  selectAddress(e) {
    const id = e.currentTarget.dataset.id;
    const pages = getCurrentPages();
    if (pages.length > 1) {
      const prevPage = pages[pages.length - 2];
      const addr = this.data.addresses.find(a => a.id === id);
      prevPage.setData({ selectedAddress: addr });
      wx.navigateBack();
    }
  },

  showAddForm() {
    this.setData({
      showForm: true, editId: null,
      form: { name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false }
    });
  },

  hideForm() {
    this.setData({ showForm: false });
  },

  editAddress(e) {
    const id = e.currentTarget.dataset.id;
    const addr = this.data.addresses.find(a => a.id === id);
    this.setData({ showForm: true, editId: id, form: { ...addr } });
  },

  deleteAddress(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除地址', content: '确认删除该收货地址？',
      success: res => {
        if (res.confirm) {
          const addresses = this.data.addresses.filter(a => a.id !== id);
          this.setData({ addresses });
          wx.setStorageSync('addresses', addresses);
        }
      }
    });
  },

  setDefault(e) {
    const id = e.currentTarget.dataset.id;
    const addresses = this.data.addresses.map(a => ({ ...a, isDefault: a.id === id }));
    this.setData({ addresses });
    wx.setStorageSync('addresses', addresses);
    wx.showToast({ title: '已设为默认', icon: 'success' });
  },

  onFormInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [`form.${key}`]: e.detail.value });
  },

  onDefaultChange(e) {
    this.setData({ 'form.isDefault': e.detail.value });
  },

  chooseRegion() {
    wx.chooseLocation({
      success: () => {}
    });
    // 使用微信内置选择器
    wx.showToast({ title: '请在表单中手动填写省市区', icon: 'none', duration: 2000 });
  },

  submitAddress() {
    const { form, editId } = this.data;
    if (!form.name || !form.phone || !form.detail) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    let addresses = [...this.data.addresses];
    if (form.isDefault) {
      addresses = addresses.map(a => ({ ...a, isDefault: false }));
    }
    if (editId) {
      addresses = addresses.map(a => a.id === editId ? { ...form, id: editId } : a);
    } else {
      addresses.push({ ...form, id: 'a' + Date.now() });
    }
    wx.setStorageSync('addresses', addresses);
    this.setData({ addresses, showForm: false });
    wx.showToast({ title: '保存成功', icon: 'success' });
  }
});
