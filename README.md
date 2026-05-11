# Artful Living — 微信原生小程序

> 3D打印 & 创意定制生活用品店铺小程序

---

## 项目结构

```
wechat-miniprogram/
├── app.js / app.json / app.wxss    ← 全局配置、样式
├── custom-tab-bar/                 ← 自定义 TabBar（购物车角标 + 定制凸起圆钮）
├── pages/
│   ├── home/           ← 首页（轮播图、功能入口、精选商品、快捷搜索）
│   ├── category/       ← 分类页（左侧菜单、商品列表、懒加载更多）
│   ├── customize/      ← 定制页（上传图片/STL/OBJ、文字描述、尺寸输入）
│   ├── cart/           ← 购物车（单选/全选、数量增减、推荐商品横滑）
│   ├── mine/           ← 我的（用户信息、订单状态栏、功能菜单、商家入口）
│   ├── productDetail/  ← 商品详情（5图轮播、规格选择弹窗、评价、定制流程）
│   ├── search/         ← 搜索页（搜索历史、热门标签、本地模拟搜索）
│   ├── orderList/      ← 我的订单（全部/待付款/待收货/已完成五状态筛选）
│   ├── address/        ← 收货地址（列表、添加/编辑 BottomSheet 表单）
│   ├── wishlist/       ← 收藏夹（网格展示、加入购物车、取消收藏）
│   ├── coupon/         ← 优惠券（可用/已用/已过期三 Tab、券面 UI）
│   └── merchant/
│       ├── merchant/       ← 商家中心（数据看板、订单流程、功能入口）
│       ├── productEdit/    ← 新增/编辑商品（图片、标签、规格参数、上下架）
│       ├── orderDetail/    ← 订单详情（进度条、报价、发货、确认收货）
│       └── customOrders/   ← 定制需求管理（快速报价、开始制作、发货）
├── cloudfunctions/
│   ├── orderManager/    ← 订单 CRUD + 状态流转 + 物流预留 + 微信支付预留
│   ├── productManager/  ← 商品 CRUD + 搜索 + 上下架
│   └── categoryManager/ ← 分类 CRUD + 排序
└── sitemap.json
```

---

## 快速运行

### 1. 导入项目

1. 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开 → **导入项目** → 选择 `wechat-miniprogram/` 目录
3. AppID 可先使用**测试号**（上线前替换为真实 AppID）

### 2. 体验路径

| 功能 | 操作 |
|------|------|
| 搜索商品 | 首页搜索框 → search 页 |
| 商品详情 | 首页卡片 → 规格选择弹窗 → 加入购物车 |
| 来图定制 | 底部「定制」Tab → 上传文件/填写需求 |
| 我的订单 | 「我的」→ 订单状态栏 → 订单列表 |
| 收藏 / 地址 / 优惠券 | 「我的」→ 功能菜单 |
| 进入商家后台 | 「我的」→「商家入口」→ 邀请码 `ARTFUL2024` |

---

## 接入云开发

### Step 1 — 开通环境

开发者工具顶部 → 「云开发」→ 开通 → 记录**环境 ID**

### Step 2 — 配置环境 ID

```js
// app.js
wx.cloud.init({ env: 'YOUR-ENV-ID', traceUser: true });
```

### Step 3 — 创建数据库集合

| 集合名 | 说明 |
|--------|------|
| `orders` | 订单 |
| `products` | 商品 |
| `categories` | 分类 |
| `users` | 用户档案 |

### Step 4 — 部署云函数

右键 `cloudfunctions/` 下每个目录 → **上传并部署（不上传 node_modules）**

完成后取消各 JS 文件中 `wx.cloud.callFunction(...)` 注释，并删除本地模拟数据即可。

---

## 接入微信支付

在 `cloudfunctions/orderManager/index.js` 的 `createPayment()` 中：

```js
const payment = await cloud.cloudPay.unifiedOrder({
  body: 'Artful Living 商品',
  outTradeNo: orderId,
  totalFee: amount * 100,   // 单位：分
  nonceStr: Math.random().toString(36).slice(2),
  tradeType: 'JSAPI',
  openId: openid,
  functionName: 'paymentCallback'
});
return { code: 0, data: payment.payment };
```

---

## 接入物流查询

在 `updateShipping()` 函数中补充快递鸟 / 顺丰 OpenAPI 调用，填入物流单号后自动推送买家订阅消息。

---

## 颜色系统

| 色值 | 用途 |
|------|------|
| `#f5f0eb` | 页面背景 |
| `#faf8f5` | 卡片背景 |
| `#3d2a1e` | 主色（按钮、选中） |
| `#c9a882` | 强调色（边框、标签） |
| `#6b4f3a` | 次级文字 |
| `#e8624a` | 角标、警告 |

---

## 商家邀请码（演示）

```
ARTFUL2024
```
> 正式上线后请替换为后端动态鉴权。
