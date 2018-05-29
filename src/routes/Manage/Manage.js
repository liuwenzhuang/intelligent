import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table } from 'antd';
import { stringify } from 'qs';
import { Api, serverUrl } from '../../config';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

class Manage extends Component {
  openDetail = record => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/manageDetail',
        state: {
          record,
        },
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
      },
      {
        title: '生成报销单失败数',
        dataIndex: 'failureCount',
        key: 'failureCount',
        align: 'center',
      },
      {
        title: '导入时间',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
      },
      {
        title: '单据管理',
        dataIndex: 'manage',
        key: 'manage',
        align: 'center',
        render: (text, record) => {
          return (
            // eslint-disable-next-line
            <a href="javascript:void(0)" onClick={this.openDetail.bind(this, record)}>
              查看
            </a>
          );
        },
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
      <PageHeaderLayout title="自动报销单管理">
        <Table
          rowKey={record => record.id}
          loading={loading.effects['manage/queryList']}
          columns={columns}
          dataSource={list}
          pagination={pagination}
        />
      </PageHeaderLayout>
    );
  }
}

export default connect(({ manage, loading }) => ({
  manage,
  loading,
}))(Manage);
