const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;
const productsCollection = db.collection('products');

exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'list':
      return await listProducts(event);
    case 'listByCategory':
      return await listByCategory(event);
    case 'getById':
      return await getProductById(event);
    case 'create':
      return await createProduct(event);
    case 'update':
      return await updateProduct(event);
    case 'delete':
      return await deleteProduct(event);
    case 'search':
      return await searchProducts(event);
    default:
      return { code: 404, message: 'action not found' };
  }
};

// 获取商品列表
async function listProducts(event) {
  const { page = 1, pageSize = 12, featured, sortBy = 'createTime', sortOrder = 'desc' } = event;
  try {
    let query = productsCollection.where({ isOnSale: true });
    if (featured) query = query.where({ featured: true });
    const countRes = await query.count();
    const res = await query
      .orderBy(sortBy, sortOrder)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    return { code: 0, data: res.data, total: countRes.total };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 按分类获取商品
async function listByCategory(event) {
  const { category, page = 1, pageSize = 12 } = event;
  try {
    let query = productsCollection.where({ isOnSale: true });
    if (category && category !== 'all') {
      query = query.where({ category });
    }
    const countRes = await query.count();
    const res = await query
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    return { code: 0, data: res.data, total: countRes.total };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 根据ID获取商品详情
async function getProductById(event) {
  const { id } = event;
  try {
    const res = await productsCollection.doc(id).get();
    // 更新浏览量
    await productsCollection.doc(id).update({
      data: { viewCount: _.inc(1) }
    });
    return { code: 0, data: res.data };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 新增商品（商家）
async function createProduct(event) {
  const { product } = event;
  const data = {
    ...product,
    isOnSale: true,
    viewCount: 0,
    salesCount: 0,
    createTime: db.serverDate(),
    updateTime: db.serverDate(),
  };
  try {
    const res = await productsCollection.add({ data });
    return { code: 0, data: { id: res._id }, message: '商品创建成功' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 修改商品（商家）
async function updateProduct(event) {
  const { id, product } = event;
  try {
    await productsCollection.doc(id).update({
      data: { ...product, updateTime: db.serverDate() }
    });
    return { code: 0, message: '商品更新成功' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 删除商品（软删除）
async function deleteProduct(event) {
  const { id } = event;
  try {
    await productsCollection.doc(id).update({
      data: { isOnSale: false, updateTime: db.serverDate() }
    });
    return { code: 0, message: '商品已下架' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 搜索商品
async function searchProducts(event) {
  const { keyword, page = 1, pageSize = 12 } = event;
  try {
    const res = await db.collection('products')
      .where({
        isOnSale: true,
        name: db.RegExp({ regexp: keyword, options: 'i' })
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    return { code: 0, data: res.data };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}
