import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Divider, Row, Col, Card } from 'antd';
import { Api } from '../../../config';
import CONSTANTS from '../Constants';

class ManageDetail extends Component {
  version = '';
  flag = '';
  record = null;

  componentDidMount() {
    const { location } = this.props;
    this.flag = location.state ? location.state.flag : null;
    this.record = location.state ? location.state.record : null;
    this.version = this.record ? this.record['version'] : null;
    this.queryList();
  }

  queryList = () => {
    const { dispatch } = this.props;
    const { version, flag } = this;
    dispatch({
      type: 'manageDetail/queryReimburseWithStatus',
      payload: {
        version,
        flag,
        current: '1',
        pageSize: '20',
        url: Api.MANAGE.QUERY_REIMBURSE_WITH_STATUS,
      },
    });
  };

  handleDeleteOrRecovery = ({ phone }, url) => {
    const { dispatch } = this.props;
    const { version } = this;
    dispatch({
      type: 'manageDetail/effectPostWithSucessModal',
      payload: {
        url,
        phone,
        version,
      },
    }).then(this.queryList);
  };

  handleSendMessage = ({ phone } = {}) => {
    const { dispatch } = this.props;
    const { version } = this;
    dispatch({
      type: 'manageDetail/effectPostWithSucessModal',
      payload: {
        version,
        phone,
        url: phone ? Api.MANAGE.SEND_MESSAGE_WITH_CONDITION : Api.MANAGE.SEND_MESSAGE,
      },
    });
  };

  generateColumns = () => {
    return [
      {
        title: '用户',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'dept',
        key: 'dept',
        align: 'center',
      },
      {
        title: '单据金额',
        dataIndex: 'billMoney',
        key: 'billMoney',
        align: 'center',
      },
      {
        title: '单据状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text, record) => {
          const { status } = record;
          return <span>{CONSTANTS.STATUSMAPPING[status]}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: (text, record) => {
          const { status } = record;
          let childs = [];
          /* eslint-disable */
          const divider = <Divider type="vertical" />;
          const viewDetailsAction = <a href="javascript:void(0)">查看详情</a>;
          const deleteAction = (
            <a
              href="javascript:void(0)"
              onClick={this.handleDeleteOrRecovery.bind(this, record, Api.MANAGE.DELETE_REIMBURSE)}
            >
              删除
            </a>
          );
          const resumeDeleteAction = (
            <a
              href="javascript:void(0)"
              onClick={this.handleDeleteOrRecovery.bind(
                this,
                record,
                Api.MANAGE.RECOVERY_REIMBURSE
              )}
            >
              恢复删除
            </a>
          );
          const dispatchNotificationAction = (
            <a href="javascript:void(0)" onClick={this.handleSendMessage.bind(this, record)}>
              发送通知
            </a>
          );
          switch (`${status}`) {
            case CONSTANTS.SUBMITTED: // 已提交
            case CONSTANTS.IMPORT_FAILURE: // 导入失败
              childs = [viewDetailsAction];
              break;
            case CONSTANTS.UNSUBMIT:
              childs = [
                deleteAction,
                divider,
                viewDetailsAction,
                divider,
                dispatchNotificationAction,
              ];
              break;
            case CONSTANTS.DELETED:
              childs = [resumeDeleteAction, divider, viewDetailsAction];
              break;
            default:
              childs = [viewDetailsAction];
              break;
          }

          return <span>{React.Children.map(childs, child => child)}</span>;
        },
        /* eslint-enable */
      },
    ];
  };

  generateHeaderContent = () => {
    const { record, flag } = this;
    let headerContent = null;
    if (record && flag) {
      /* eslint-disable */
      const { reimburseName, time, successCount, failureCount, changeFileName, fileName } = record;
      headerContent = (
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="middle" type="flex">
          <Col md={4} xs={24}>
            {reimburseName}
          </Col>
          <Col md={8} xs={24}>
            {`导入时间:${time}`}
          </Col>
          {flag === CONSTANTS.SUCCESS ? (
            <Fragment>
              <Col md={8} xs={24}>
                导入成功：{successCount}
              </Col>
              <Col md={4} xs={24}>
                <a href="javascript:void(0)" onClick={this.handleSendMessage}>
                  全部发送通知
                </a>
              </Col>
            </Fragment>
          ) : null}
          {flag === CONSTANTS.FAILURE ? (
            <Fragment>
              <Col md={8} xs={24}>
                导入失败：{failureCount}
              </Col>
              <Col md={4} xs={24}>
                <a>下载导入失败数据</a>
              </Col>
            </Fragment>
          ) : null}
        </Row>
      );
      /* eslint-enable */
    }
    return headerContent;
  };

  render() {
    const columns = this.generateColumns();
    const headerContent = this.generateHeaderContent();
    const {
      manageDetail: { list, pagination },
    } = this.props;
    return (
      <Fragment>
        <Card title="自动报销单管理单据">{headerContent}</Card>
        <Table
          style={{ marginTop: 16 }}
          rowKey={record => record.id}
          columns={columns}
          dataSource={list}
          pagination={pagination}
        />
      </Fragment>
    );
  }
}

export default connect(({ manageDetail, loading }) => ({
  manageDetail,
  loading,
}))(ManageDetail);
