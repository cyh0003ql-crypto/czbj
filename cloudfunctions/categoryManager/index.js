const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const categoriesCollection = db.collection('categories');

exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'list':
      return await listCategories();
    case 'getById':
      return await getCategoryById(event);
    case 'create':
      return await createCategory(event);
    case 'update':
      return await updateCategory(event);
    case 'delete':
      return await deleteCategory(event);
    case 'reorder':
      return await reorderCategories(event);
    default:
      return { code: 404, message: 'action not found' };
  }
};

// 获取所有分类
async function listCategories() {
  try {
    const res = await categoriesCollection
      .where({ isActive: true })
      .orderBy('sortOrder', 'asc')
      .get();
    return { code: 0, data: res.data };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 根据ID获取分类
async function getCategoryById(event) {
  const { id } = event;
  try {
    const res = await categoriesCollection.doc(id).get();
    return { code: 0, data: res.data };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 新增分类
async function createCategory(event) {
  const { category } = event;
  try {
    const countRes = await categoriesCollection.count();
    const data = {
      ...category,
      isActive: true,
      sortOrder: countRes.total,
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
    };
    const res = await categoriesCollection.add({ data });
    return { code: 0, data: { id: res._id }, message: '分类创建成功' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 修改分类
async function updateCategory(event) {
  const { id, category } = event;
  try {
    await categoriesCollection.doc(id).update({
      data: { ...category, updateTime: db.serverDate() }
    });
    return { code: 0, message: '分类更新成功' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 删除分类（软删除）
async function deleteCategory(event) {
  const { id } = event;
  try {
    await categoriesCollection.doc(id).update({
      data: { isActive: false, updateTime: db.serverDate() }
    });
    return { code: 0, message: '分类已禁用' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 排序分类
async function reorderCategories(event) {
  const { orders } = event; // [{ id, sortOrder }]
  try {
    await Promise.all(orders.map(({ id, sortOrder }) =>
      categoriesCollection.doc(id).update({ data: { sortOrder } })
    ));
    return { code: 0, message: '排序更新成功' };
  } catch (e) {
    return { code: 500, message: e.message };
  }
}

// 示例数据结构（初始化时写入）
const sampleCategories = [
  { name: '全部', icon: '🗂', sortOrder: 0 },
  { name: '来图定制', icon: '🖼', sortOrder: 1 },
  { name: '模型打印', icon: '🧊', sortOrder: 2 },
  { name: '桌面摆件', icon: '🐱', sortOrder: 3 },
  { name: '家居装饰', icon: '🏠', sortOrder: 4 },
  { name: '花器花瓶', icon: '🌸', sortOrder: 5 },
  { name: '手办雕塑', icon: '🗿', sortOrder: 6 },
  { name: '企业礼品', icon: '🎁', sortOrder: 7 },
];
