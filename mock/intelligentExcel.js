const { SUCCESS_SHELL } = require('./common');

module.exports = {
  [`POST /reimburse/queryReimburseType`](req, res) {
    res.status(200).json({
      ...SUCCESS_SHELL,
      data: {
        success: true,
        message: '成功',
        data: [
          { name: '自动报销-固定通讯', id: 'adSCO1pF75wa5li8S2YhM' },
          { name: '自动报销-固定交通', id: 'S6SCb34JEbxR6KuhhrBCi' },
          { name: '自动报销-固定交通-固定通讯', id: 'DxSCcbYJcRpt4LtDWzJcd' },
        ],
      },
    });
  },
};
