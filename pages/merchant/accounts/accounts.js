const app = getApp();

Page({
  data: {
    subAccounts: [],
    showForm: false,
    editId: null,
    permOptions: [
      { key: 'products', label: '商品管理', icon: '📦', desc: '新增、编辑、上下架商品' },
      { key: 'orders', label: '订单管理', icon: '📋', desc: '查看、处理、发货订单' },
      { key: 'customOrders', label: '定制需求', icon: '✏', desc: '处理定制报价和制作' },
      { key: 'reports', label: '数据报表', icon: '📊', desc: '查看销售数据和分析' },
    ],
    form: { name: '', username: '', password: '', permissions: [] }
  },

  onLoad() {
    this.loadAccounts();
  },

  loadAccounts() {
    const data = app.getMerchantAccounts();
    this.setData({ subAccounts: data.subAccounts || [] });
  },

  showAddForm() {
    this.setData({
      showForm: true, editId: null,
      form: { name: '', username: '', password: '', permissions: ['orders'] }
    });
  },

  hideForm() {
    this.setData({ showForm: false });
  },

  editAccount(e) {
    const id = e.currentTarget.dataset.id;
    const acc = this.data.subAccounts.find(a => a.id === id);
    if (!acc) return;
    this.setData({ showForm: true, editId: id, form: { name: acc.name, username: acc.username, password: '', permissions: [...acc.permissions] } });
  },

  deleteAccount(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除子账号', content: '确认删除该子账号？删除后不可恢复。',
      success: res => {
        if (res.confirm) {
          const data = app.getMerchantAccounts();
          data.subAccounts = data.subAccounts.filter(a => a.id !== id);
          app.saveMerchantAccounts(data);
          this.setData({ subAccounts: data.subAccounts });
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  onToggleAccount(e) {
    const id = e.currentTarget.dataset.id;
    const enabled = e.detail.value;
    const data = app.getMerchantAccounts();
    const acc = data.subAccounts.find(a => a.id === id);
    if (acc) acc.enabled = enabled;
    app.saveMerchantAccounts(data);
    this.setData({ subAccounts: [...data.subAccounts] });
    wx.showToast({ title: enabled ? '已启用' : '已停用', icon: 'success', duration: 800 });
  },

  onFormInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [`form.${key}`]: e.detail.value });
  },

  onPermToggle(e) {
    const key = e.currentTarget.dataset.key;
    const enabled = e.detail.value;
    let perms = [...this.data.form.permissions];
    if (enabled && !perms.includes(key)) perms.push(key);
    else if (!enabled) perms = perms.filter(p => p !== key);
    this.setData({ 'form.permissions': perms });
  },

  submitForm() {
    const { form, editId } = this.data;
    if (!form.name.trim()) { wx.showToast({ title: '请填写账号名称', icon: 'none' }); return; }
    if (!form.username.trim()) { wx.showToast({ title: '请填写用户名', icon: 'none' }); return; }
    if (!editId && (!form.password || form.password.length < 6)) {
      wx.showToast({ title: '密码至少6位', icon: 'none' }); return;
    }

    const data = app.getMerchantAccounts();
    if (editId) {
      const idx = data.subAccounts.findIndex(a => a.id === editId);
      if (idx > -1) {
        data.subAccounts[idx] = { ...data.subAccounts[idx], name: form.name, username: form.username, permissions: form.permissions };
      }
    } else {
      // 检查用户名唯一性
      const exists = data.subAccounts.find(a => a.username === form.username);
      if (exists) { wx.showToast({ title: '该用户名已存在', icon: 'none' }); return; }
      data.subAccounts.push({
        id: 'sub_' + Date.now(),
        name: form.name,
        username: form.username,
        password: form.password,
        role: 'sub',
        permissions: form.permissions,
        enabled: true,
        createdAt: new Date().toLocaleDateString('zh-CN')
      });
    }

    app.saveMerchantAccounts(data);
    this.setData({ subAccounts: data.subAccounts, showForm: false });
    wx.showToast({ title: editId ? '修改成功' : '创建成功', icon: 'success' });
  }
});
