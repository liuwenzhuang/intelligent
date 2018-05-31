import { pageModel } from './common';
import modelExtend from 'dva-model-extend';
import { commonPost } from '../services/api';
import queryString from 'query-string';
import { Api } from '../config';

export default modelExtend(pageModel, {
  namespace: 'manageDetail',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { version, flag } = queryString.parse(location.search);
        if (location.pathname === '/manageDetail') {
          dispatch({
            type: 'queryReimburseWithStatus',
            payload: {
              version,
              flag,
              current: 1,
              pageSize: 20,
              url: Api.MANAGE.QUERY_REIMBURSE_WITH_STATUS,
            },
          });
        }
      });
    },
  },

  effects: {
    *queryReimburseWithStatus({ payload }, { put, call }) {
      const { success, data, pagination } = yield call(commonPost, payload);
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data,
            pagination,
          },
        });
      }
    },

    *sendMessage({ payload }, { put, call }) {
      const { success, message } = yield call(commonPost, payload);
      if (success) {
        yield put({
          type: 'showSuccessModal',
          payload: {
            content: message,
          },
        });
      }
    },

    *deleteOrRecovery({ payload }, { put, call }) {
      const { success, message } = yield call(commonPost, payload);
      if (success) {
        yield put({
          type: 'showSuccessModal',
          payload: {
            content: message,
          },
        });
      }
    },
  },
});
