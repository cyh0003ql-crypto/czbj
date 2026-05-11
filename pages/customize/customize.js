Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  data: {
    uploadedFiles: [],
    activeStep: '',
    textDesc: '',
    sizeL: '',
    sizeW: '',
    sizeH: '',
    sizeNote: ''
  },

  onUpload() {
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择图片', '选择模型文件(STL/OBJ)'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.chooseImage('camera');
        } else if (res.tapIndex === 1) {
          this.chooseImage('album');
        } else {
          this.chooseFile();
        }
      }
    });
  },

  chooseImage(sourceType) {
    wx.chooseMedia({
      count: 5,
      mediaType: ['image'],
      sourceType: [sourceType],
      success: (res) => {
        const files = res.tempFiles.map(f => ({
          path: f.tempFilePath,
          type: 'image',
          name: f.tempFilePath.split('/').pop()
        }));
        const uploadedFiles = [...this.data.uploadedFiles, ...files].slice(0, 9);
        this.setData({ uploadedFiles });
      }
    });
  },

  chooseFile() {
    wx.chooseMessageFile({
      count: 3,
      type: 'file',
      extension: ['stl', 'obj', 'png', 'jpg', 'jpeg'],
      success: (res) => {
        const files = res.tempFiles.map(f => ({
          path: f.path,
          type: 'model',
          name: f.name
        }));
        const uploadedFiles = [...this.data.uploadedFiles, ...files].slice(0, 9);
        this.setData({ uploadedFiles });
      }
    });
  },

  removeFile(e) {
    const index = e.currentTarget.dataset.index;
    const uploadedFiles = this.data.uploadedFiles.filter((_, i) => i !== index);
    this.setData({ uploadedFiles });
  },

  onStepTap(e) {
    const step = e.currentTarget.dataset.step;
    this.setData({ activeStep: this.data.activeStep === step ? '' : step });
  },

  onTextInput(e) {
    this.setData({ textDesc: e.detail.value });
  },

  onSizeInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [key]: e.detail.value });
  },

  onSubmit() {
    if (!this.data.uploadedFiles.length && !this.data.textDesc) {
      wx.showToast({ title: '请上传文件或填写描述', icon: 'none' });
      return;
    }

    const orderData = {
      files: this.data.uploadedFiles,
      textDesc: this.data.textDesc,
      size: { l: this.data.sizeL, w: this.data.sizeW, h: this.data.sizeH, note: this.data.sizeNote },
      createTime: new Date().toISOString(),
      status: 'pending'
    };

    wx.showLoading({ title: '提交中...', mask: true });

    // 云函数调用示例
    // wx.cloud.callFunction({
    //   name: 'orderManager',
    //   data: { action: 'create', order: orderData }
    // }).then(res => {
    //   wx.hideLoading();
    //   wx.showToast({ title: '提交成功！', icon: 'success' });
    // });

    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '提交成功',
        content: '您的定制需求已提交，客服将在24小时内联系您确认方案和报价',
        showCancel: false,
        confirmText: '好的',
        success: () => {
          this.setData({
            uploadedFiles: [],
            textDesc: '',
            sizeL: '',
            sizeW: '',
            sizeH: '',
            sizeNote: '',
            activeStep: ''
          });
        }
      });
    }, 1200);
  }
});
