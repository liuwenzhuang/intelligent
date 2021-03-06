import modelExtend from 'dva-model-extend';
import { Modal, message } from 'antd';
import { commonPost, commonGet } from '../services/api';

const model = {
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

const pageModel = modelExtend(model, {
  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: 10,
    },
  },

  effects: {
    *effectPostWithSucessModal({ payload }, { call, put }) {
      const { success, message } = yield call(commonPost, payload);
      if (!success) throw message;
      Modal.info({
        title: '提示',
        content: message,
      });
      return message;
    },

    *effectGetWithModal({ payload }, { call, put }) {
      const { success, message } = yield call(commonGet, payload);
      if (!success) throw message;
      Modal.info({
        title: '提示',
        content: message,
      });
      return message;
    },

    *showSuccessModal({ payload }) {
      const { title = '提示', content = '操作成功' } = payload;
      yield Modal.info({
        title,
        content,
      });
    },

    *showSuccessMessage({ payload }) {
      const { content } = payload;
      yield message.success(content);
    }
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { list, pagination } = payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      };
    },
  },
});

export { model, pageModel };
