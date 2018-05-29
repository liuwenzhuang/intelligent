const Mock = require('mockjs');
const { Random } = Mock;

let data = [];

for (let i = 0; i < 200; i++) {
  data.push({
    id: Random.increment(),
    reimburseName: Random.cname(),
    successCount: Random.integer(10, 2000),
    failureCount: Random.integer(0, 10),
    time: Random.date('yyyy-MM-dd'),
    version: Random.guid(),
  });
}

module.exports = {

  [`POST /reimburse/queryReimburseList`](req, res, u) {
    const { body } = req;
    let { pageSize = 10, current = 1 } = body;
    res.status(200).json({
      success: true,
      information: '请求成功',
      data: data.slice((current - 1) * pageSize, current * pageSize),
      pagination: {
        current: Number(current),
        pageSize: Number(pageSize),
        total: data.length,
      },
    });
  },
};
