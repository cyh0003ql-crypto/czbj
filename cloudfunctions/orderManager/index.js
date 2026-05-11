const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;
const ordersCollection = db.collection('orders');

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { action } = event;

  switch (action) {
    case 'create':
      return await createOrder(event, openid);
    case 'list':
      return await listOrders(event, openid);
    case 'getById':
      return await getOrderById(event);
    case 'updateStatus':
      return await updateOrderStatus(event);
    case 'delete':
      return await deleteOrder(event);
    case 'getStats':
      return await getStats();
    case 'updateShipping':
      return await updateShipping(event);
    case 'createPayment':
      return await createPayment(event, openid);
    default:
      return { code: 404, message: 'action not found' };
  }
};

// 创建订单
async function createOrder(event, openid) {
  const { order } = event;
  const data = {
    ...order,
    openid,
    status: 'pending_quote',  // pending_quote | quoting | confirmed | producing | shipping | completed | cancelled | refunding
    createTime: db.serverDate(),
    updateTime: db.serverDate(),
  };
  try {
    const res = await ordersCollection.add({ data });
    return { code: 0, data: { id: res._id }, message: '订单创建成功' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 查询订单列表
async function listOrders(event, openid) {
  const { status, page = 1, pageSize = 10, isMerchant } = event;
  try {
    let query = isMerchant ? ordersCollection : ordersCollection.where({ openid });
    if (status && status !== 'all') {
      query = query.where({ status });
    }
    const countRes = await query.count();
    const res = await query
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    return {
      code: 0,
      data: res.data,
      total: countRes.total,
      page,
      pageSize
    };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 根据ID获取订单
async function getOrderById(event) {
  const { id } = event;
  try {
    const res = await ordersCollection.doc(id).get();
    return { code: 0, data: res.data };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 更新订单状态（商家操作）
async function updateOrderStatus(event) {
  const { id, status, note } = event;
  try {
    await ordersCollection.doc(id).update({
      data: {
        status,
        statusNote: note || '',
        updateTime: db.serverDate(),
      }
    });
    // TODO: 触发订阅消息推送给用户
    // await sendSubscribeMessage(openid, status);
    return { code: 0, message: '状态更新成功' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 删除订单
async function deleteOrder(event) {
  const { id } = event;
  try {
    await ordersCollection.doc(id).remove();
    return { code: 0, message: '删除成功' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 获取统计数据
async function getStats() {
  try {
    const [quoting, producing, shipping, completed] = await Promise.all([
      ordersCollection.where({ status: 'pending_quote' }).count(),
      ordersCollection.where({ status: 'producing' }).count(),
      ordersCollection.where({ status: 'shipping' }).count(),
      ordersCollection.where({ status: 'completed' }).count(),
    ]);
    return {
      code: 0,
      data: {
        quoting: quoting.total,
        producing: producing.total,
        shipping: shipping.total,
        completed: completed.total,
      }
    };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 更新物流信息（预留接口）
async function updateShipping(event) {
  const { id, trackingNo, trackingCompany, shippingTime } = event;
  try {
    await ordersCollection.doc(id).update({
      data: {
        status: 'shipping',
        trackingNo,
        trackingCompany,
        shippingTime: shippingTime || db.serverDate(),
        updateTime: db.serverDate(),
      }
    });
    return { code: 0, message: '物流信息更新成功' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 创建支付（预留微信支付接口）
async function createPayment(event, openid) {
  const { orderId, amount } = event;
  // TODO: 接入微信支付
  // const payment = await cloud.cloudPay.unifiedOrder({ ... });
  return {
    code: 0,
    message: '微信支付接口预留，接入后在此实现',
    data: {
      orderId,
      amount,
      openid,
      timestamp: Date.now(),
      // paymentParams: payment  // 接入后返回支付参数
    }
  };
}
