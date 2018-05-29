import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Divider, Row, Col, Tabs } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { Api, serverUrl } from '../../../config';
import { stringify } from 'qs';

const TabPane = Tabs.TabPane;

class ManageDetail extends Component {
  generateColumns = () => {
    return [
      {
        title: '用户',
        dataIndex: 'reimburseName',
        key: 'reimburseName',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'successCount',
        key: 'successCount',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'failureCount',
        key: 'failureCount',
        align: 'center',
      },
      {
        title: '单据金额',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
      },
      {
        title: '单据状态',
        dataIndex: 'manage',
        key: 'manage',
        align: 'center',
        render: (text, record) => {
          return (
            // eslint-disable-next-line
            <a href="javascript:void(0)" onClick={this.openDetail}>
              查看
            </a>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'download',
        key: 'download',
        align: 'center',
        render: (text, record) => {
          /* eslint-disable */
          return (
            <span>
              <a href={`${serverUrl}/exportExcel?id=${record.id}`}>删除</a>
              <Divider type="vertical" />
              <a href="javascript:void(0)">查看详情</a>
              <Divider type="vertical" />
              <a href="javascript:void(0)">查看通知</a>
            </span>
          );
        },
        /* eslint-enable */
      },
    ];
  };

  generateHeaderContent = () => {
    const { location } = this.props;
    const record = location.state ? location.state.record : null;
    let headerContent = null;
    if (record) {
      const { reimburseName, time, successCount, failureCount, changeFileName, fileName } = record;
      headerContent = (
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="middle" type="flex">
          <Col md={4} xs={24}>
            {reimburseName}
          </Col>
          <Col md={8} xs={24}>
            {`导入时间:${time}`}
          </Col>
          <Col md={8} xs={24}>
            {`导入成功:${successCount}  导入失败:${failureCount}`}
          </Col>
          <Col md={4} xs={24}>
            <span>
              <a
                href={`${serverUrl}${Api.ALIYUN.DOWNLOAD_FILE_FROM_ALIYUN}?${stringify({
                  changeFileName,
                  fileName,
                })}`}
                target="_blank"
              >
                数据下载
              </a>
              <Divider type="vertical" />
              <a>全部发送通知</a>
            </span>
          </Col>
        </Row>
      );
    }
    return headerContent;
  };

  render() {
    const columns = this.generateColumns();
    const headerContent = this.generateHeaderContent();
    const {
      manage: { list, pagination },
    } = this.props;
    return (
      <PageHeaderLayout title="自动报销单管理单据" extraContent={headerContent}>
        <Tabs>
          <TabPane tab="导入成功单据" key="success">
            <Table columns={columns} dataSource={list} pagination={pagination} />
          </TabPane>
          <TabPane tab="导入失败单据" key="failure">
            <Table columns={columns} dataSource={list} pagination={pagination} />
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ manage, loading }) => ({
  manage,
  loading,
}))(ManageDetail);
