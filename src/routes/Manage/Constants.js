const SUCCESS = '0';
const FAILURE = '1';

const IMPORT_FAILURE = '-1';
const DELETED = '0';
const UNSUBMIT = '1';
const SUBMITTED = '2';
const STATUSMAPPING = {
  [IMPORT_FAILURE]: '导入失败',
  [DELETED]: '已删除',
  [UNSUBMIT]: '待提交',
  [SUBMITTED]: '已提交',
};

const SENDTYPEMAPPING = {
  'single': 'single',
  'multiple': 'multiple'
};

export default {
  SUCCESS,
  FAILURE,
  IMPORT_FAILURE,
  DELETED,
  UNSUBMIT,
  SUBMITTED,
  STATUSMAPPING,
  SENDTYPEMAPPING,
};
