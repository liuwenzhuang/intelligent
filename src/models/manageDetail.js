import { pageModel } from './common';
import modelExtend from 'dva-model-extend';
import { commonPost } from '../services/api';

export default modelExtend(pageModel, {
  namespace: 'manageDetail',

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
  },
});
