const serverSuffix = 'data-stats-system';
const serverUrl =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//${process.env.SERVER_ENV}/intelligent`
    : '';
const appName = '商旅服务--友报账';
const appAuthor = 'liuwzhb';
const authorEmail = 'liuwzhb@yonyou.com';

const ctripApiPrefix = '/ctrip';
const ctripGroupPrefix = '/ctrip/ctripGroup';
const smeCtripPrefix = '/smeCtrip';

const Api = {
  INTELLIGENTEXCEL: {
    QUERY_REIMBURSE_TYPE: `/reimburse/queryReimburseType`,
  },
  MANAGE: {
    QUERY_REIMBURSE_LIST: `/reimburse/queryReimburseList`,
    QUERY_REIMBURSE_WITH_STATUS: `/queryReimburseWithStatus`,
    DELETE_REIMBURSE: `/deleteReimburse`,
    RECOVERY_REIMBURSE: `/recoveryReimburse`,
    SEND_MESSAGE: `/sendMessage`,
    SEND_MESSAGE_WITH_CONDITION: `/sendMessageWithCondition`,
    EXPORT_FAILURE_EXCEL: `/exportFailureExcel`,
  },
  ALIYUN: {
    DOWNLOAD_FILE_FROM_ALIYUN: `/downloadFileFromALiyun`,
  },
  CTRIP: {
    ORG_INFO: `${ctripApiPrefix}/orginfo`,
    DEPT_AUTH: `${ctripApiPrefix}/deptauth`,
    UPDATE_DEPT_AUTH: `${ctripApiPrefix}/updatedeptauth`,
    USER_AUTH: `${ctripApiPrefix}/userauth`,
    UPDATE_USER_AUTH: `${ctripApiPrefix}/updateuserauth`,
    FIND_USER_BY_FILTER: `${ctripApiPrefix}/finduserbyfilter`,
  },
  CTRIPGROUP: {
    QUERY_GROUPS: `${ctripGroupPrefix}/groups`,
    QUERY_GROUP: `${ctripGroupPrefix}/group`,
    DELETE_GROUP: `${ctripGroupPrefix}/delgroup`,
    ADD_GROUP: `${ctripGroupPrefix}/addGroup`,
    UPDATE_GROUP: `${ctripGroupPrefix}/updateGroup`,
    ADD_MANAGER: `${ctripApiPrefix}/ctripClientManager/add`,
    UPDATE_MANAGER: `${ctripApiPrefix}/ctripClientManager/update`,
    QUERY_MANAGER: `${ctripApiPrefix}/ctripClientManager/find`,
    QUERY_USERS: `${ctripApiPrefix}/userfilter/users`,
    ADD_GROUP_USERS: `${ctripApiPrefix}/ctripGroupMember/addgroupmembers`,
    QUERY_GROUP_USERS: `${ctripApiPrefix}/ctripGroupMember/groupmembers`,
    UPDATE_GROUP_USER_NOTE: `${ctripApiPrefix}/ctripGroupMember/updatenote`,
    ADJUST_GROUP: `${ctripApiPrefix}/ctripGroupMember/updategid`,
    DELETE_GROUP_USERS: `${ctripApiPrefix}/ctripGroupMember/delgroupmembers`,
    EXPORT: `${ctripApiPrefix}/ctripGroupMember/export`,
  },
  SMECTRIP: {
    IS_OPEN: `${smeCtripPrefix}/isOpen`,
    REGISTER_COMPANY: `${smeCtripPrefix}/registerCompany`,
    SSOLOGIN: `${smeCtripPrefix}/ssologin/pc`,
    SYNC_USERS: `${smeCtripPrefix}/syncUsers`,
    SYNC_ALL_USERS: `${smeCtripPrefix}/syncAllUsers`,
    SYNC_DEPT: `${smeCtripPrefix}/syncDept`,
    SYNC_ALL_DEPT: `${smeCtripPrefix}/syncAllDept`,
  },
};

module.exports = {
  serverSuffix,
  serverUrl,
  appName,
  appAuthor,
  authorEmail,
  Api,
};
