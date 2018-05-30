const Mock = require('mockjs');
const { Random } = Mock;

let data = [];

for (let i = 0; i < 200; i++) {
  data.push({
    id: Random.increment(),
    userName: Random.cname(),
    phone: Mock.mock('@string("number", 11)'),
    dept: Random.name(),
    billMoney: Random.integer(200, 2000),
    status: Random.integer(-1, 2),
  });
}

module.exports = {

  [`POST /queryReimburseWithStatus`](req, res, u) {
    const { body } = req;
    let { pageSize = 10, current = 1 } = body;
    res.status(200).json({
      success: true,
      message: '请求成功',
      data: data.slice((current - 1) * pageSize, current * pageSize),
      pagination: {
        current: Number(current),
        pageSize: Number(pageSize),
        total: data.length,
      },
    });
  },

  [`POST /sendMessage`](req, res) {
    res.status(200).json({
      success: true,
      message: '发送通知成功'
    });
  },

  [`POST /sendMessageWithCondition`](req, res) {
    res.status(200).json({
      success: true,
      message: '发送通知成功'
    });
  },

  [`POST /deleteReimburse`](req, res) {
    res.status(200).json({
      success: true,
      message: '删除成功'
    });
  }
};
