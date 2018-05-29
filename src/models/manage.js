import { pageModel } from './common';
import modelExtend from 'dva-model-extend';
import { commonPost } from '../services/api';
import { Api } from '../config';

export default modelExtend(pageModel, {
  namespace: 'manage',

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      return history.listen(({ pathname, search }) => {
        if (pathname === '/manage') {
          dispatch({
            type: 'queryList',
            payload: {
              url: Api.MANAGE.QUERY_REIMBURSE_LIST,
              current: 1,
              pageSize: 10,
            },
          });
        }
      });
    },
  },

  effects: {
    *queryList({ payload }, { put, call }) {
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
  },
});
