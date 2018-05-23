import { pageModel } from './common';
import modelExtend from 'dva-model-extend';
import { commonPost } from '../services/api';
import { Api } from '../config';

export default modelExtend(pageModel, {
  namespace: 'intelligentExcel',

  state: {
    types: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      return history.listen(({ pathname, search }) => {
        if (pathname === '/intelligentexcel') {
          dispatch({
            type: 'getBillType',
            payload: {
              url: Api.INTELLIGENTEXCEL.QUERY_REIMBURSE_TYPE,
              type: 'zdbx',
            },
          });
        }
      });
    },
  },

  effects: {
    *getBillType({ payload = { url: Api.INTELLIGENTEXCEL.QUERY_REIMBURSE_TYPE } }, { call, put }) {
      const { success, data } = yield call(commonPost, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: { types: data },
        });
      }
    },
  },
});
