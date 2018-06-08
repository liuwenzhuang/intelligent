const SUCCESS = '0';
const FAILURE = '1';

const IMPORT_FAILURE = '-1';
const SUBMIT_ERROR = '-2';
const DELETED = '0';
const UNSUBMIT = '1';
const SUBMITTED = '2';
const APPROVING = '3';
const FINISHED = '4';
const STATUSMAPPING = {
  [IMPORT_FAILURE]: '导入失败',
  [SUBMIT_ERROR]: '提交失败',
  [DELETED]: '已删除',
  [UNSUBMIT]: '待提交',
  [SUBMITTED]: '已提交',
  [APPROVING]: '审批中',
  [FINISHED]: '已完成',
};

const SENDTYPEMAPPING = {
  'single': 'single',
  'multiple': 'multiple'
};

export default {
  SUCCESS,
  FAILURE,
  IMPORT_FAILURE,
  SUBMIT_ERROR,
  DELETED,
  UNSUBMIT,
  SUBMITTED,
  APPROVING,
  FINISHED,
  STATUSMAPPING,
  SENDTYPEMAPPING,
};
