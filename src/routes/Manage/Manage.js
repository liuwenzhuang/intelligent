import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import queryString from 'query-string';
import { Card, Button } from 'antd';
import List from './List';
import { Api } from '../../config';
import styles from './index.less';

const Manage = ({ dispatch, loading, manage }) => {
  /**
   * 根据flag标志跳转“成功”或“失败”页面
   */
  const handleOpenDetail = (record, flag) => {
    const { version } = record;
    dispatch(
      routerRedux.push({
        pathname: '/manageDetail',
        search: queryString.stringify({
          ...record,
          flag,
          version,
        }),
      })
    );
  };

  const handleTableChange = ({ current, pageSize }) => {
    dispatch({
      type: 'manage/queryList',
      payload: {
        url: Api.MANAGE.QUERY_REIMBURSE_LIST,
        current,
        pageSize,
      },
    });
  };

  const { list, pagination } = manage;
  const tableProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['manage/queryList'],
    onChange: handleTableChange,
    onOpenDetail: handleOpenDetail,
  };
  return (
    <Card
      title="自动报销单管理"
      extra={
        <Button type="primary">
          <Link to={'/intelligentexcel'}>自动报销单制单</Link>
        </Button>
      }
      className={styles.manage}
    >
      <List {...tableProps} />
    </Card>
  );
};

export default connect(({ manage, loading }) => ({
  manage,
  loading,
}))(Manage);
