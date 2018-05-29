import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Card, Button } from 'antd';
import { stringify } from 'qs';
import { Api, serverUrl } from '../../config';
import CONSTANTS from './Constants';
import styles from './index.less';

class Manage extends Component {
  /**
   * 根据flag标志跳转“成功”或“失败”页面
   */
  openDetail = (record, flag) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/manageDetail',
        state: {
          record,
          flag,
        },
      })
    );
  };

  openCreatePage = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/intelligentexcel',
      })
    );
  };

  generateColumns = () => {
    return [
      {
        title: '单据名称',
        dataIndex: 'reimburseName',
        key: 'reimburseName',
        align: 'center',
      },
      {
        title: '成功生成报销单数',
        dataIndex: 'successCount',
        key: 'successCount',
        align: 'center',
        render: (text, record) => {
          /* eslint-disable */
          const { successCount = 0 } = record;
          return (
            <a
              href="javascript:void(0)"
              onClick={this.openDetail.bind(this, record, CONSTANTS.SUCCESS)}
            >
              {successCount}
            </a>
          );
        },
        /* eslint-enable */
      },
      {
        title: '生成报销单失败数',
        dataIndex: 'failureCount',
        key: 'failureCount',
        align: 'center',
        render: (text, record) => {
          /* eslint-disable */
          const { failureCount = 0 } = record;
          return failureCount == 0 ? (
            <span>{failureCount}</span>
          ) : (
            <a
              href="javascript:void(0)"
              onClick={this.openDetail.bind(this, record, CONSTANTS.FAILURE)}
            >
              {failureCount}
            </a>
          );
        },
        /* eslint-enable */
      },
      {
        title: '导入时间',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
      },
      {
        title: '数据下载',
        dataIndex: 'download',
        key: 'download',
        align: 'center',
        render: (text, record) => {
          const { changeFileName, fileName } = record;
          return (
            <a
              href={`${serverUrl}${Api.ALIYUN.DOWNLOAD_FILE_FROM_ALIYUN}?${stringify({
                changeFileName,
                fileName,
              })}`}
              target="_blank"
            >
              下载
            </a>
          );
        },
      },
    ];
  };

  render() {
    const columns = this.generateColumns();
    const {
      manage: { list, pagination },
      loading,
    } = this.props;
    return (
      <Card
        title="自动报销单管理"
        extra={
          <Button type="primary" onClick={this.openCreatePage}>
            自动报销单制单
          </Button>
        }
        className={styles.manage}
      >
        <Table
          rowKey={record => record.id}
          loading={loading.effects['manage/queryList']}
          columns={columns}
          dataSource={list}
          pagination={pagination}
        />
      </Card>
    );
  }
}

export default connect(({ manage, loading }) => ({
  manage,
  loading,
}))(Manage);
