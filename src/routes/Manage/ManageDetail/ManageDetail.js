import React, { Fragment } from 'react';
import { connect } from 'dva';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { Table, Divider, Row, Col, Card, message, Popconfirm } from 'antd';
import { Api, serverUrl } from '../../../config';
import CONSTANTS from '../Constants';
import AsyncTrigger from '../../../components/AsyncTrigger';
import SendMessageModal from './SendMessageModal';

let triggerId = '';

const ManageDetail = ({ location, manageDetail, loading, dispatch }) => {
  const query = queryString.parse(location.search);
  const { flag, version } = query;

  const queryList = ({ current = 1, pageSize = 20 } = {}) => {
    dispatch({
      type: 'manageDetail/queryReimburseWithStatus',
      payload: {
        version,
        flag,
        current,
        pageSize,
        url: Api.MANAGE.QUERY_REIMBURSE_WITH_STATUS,
      },
    });
  };

  const handleDeleteOrRecovery = ({ phone, id }, url) => {
    triggerId = id;
    dispatch({
      type: 'manageDetail/deleteOrRecovery',
      payload: {
        url,
        phone,
        version,
      },
    }).then(queryList);
  };

  const generateColumns = () => {
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
          const { status, billDetailUrl, id, phone } = record;
          let childs = [];
          /* eslint-disable */
          const divider = <Divider type="vertical" />;
          const viewDetailsAction = <a href={billDetailUrl}>查看详情</a>;
          const deleteAction = (
            <AsyncTrigger
              loading={loading.effects['manageDetail/deleteOrRecovery'] && triggerId === id}
            >
              <Popconfirm
                title="确定删除该单据?"
                okText="确认删除"
                cancelText="取消"
                onConfirm={() => handleDeleteOrRecovery(record, Api.MANAGE.DELETE_REIMBURSE)}
              >
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            </AsyncTrigger>
          );
          const resumeDeleteAction = (
            <AsyncTrigger
              loading={loading.effects['manageDetail/deleteOrRecovery'] && triggerId === id}
            >
              <a
                href="javascript:void(0)"
                onClick={() => handleDeleteOrRecovery(record, Api.MANAGE.RECOVERY_REIMBURSE)}
              >
                恢复删除
              </a>
            </AsyncTrigger>
          );
          const dispatchNotificationAction = (
            <a
              href="javascript:void(0)"
              onClick={() => {
                dispatch({
                  type: 'manageDetail/showModal',
                  payload: { sendType: CONSTANTS.SENDTYPEMAPPING.single, phone },
                });
              }}
            >
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

  const generateHeaderContent = () => {
    let headerContent = null;
    if (query) {
      /* eslint-disable */
      const {
        reimburseName,
        createTime = '',
        successCount,
        failureCount,
        changeFileName,
        fileName,
        version,
      } = query;
      headerContent = (
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="middle" type="flex">
          <Col md={4} xs={24}>
            {reimburseName}
          </Col>
          <Col md={8} xs={24}>
            {`导入时间:${createTime}`}
          </Col>
          {flag === CONSTANTS.SUCCESS ? (
            <Fragment>
              <Col md={8} xs={24}>
                导入成功：{successCount}
              </Col>
              <Col md={4} xs={24}>
                <a
                  href="javascript:void(0)"
                  onClick={() =>
                    dispatch({
                      type: 'manageDetail/showModal',
                      payload: { sendType: CONSTANTS.SENDTYPEMAPPING.multiple },
                    })
                  }
                >
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
                <a
                  target="_blank"
                  href={`${serverUrl}${Api.MANAGE.EXPORT_FAILURE_EXCEL}?version=${version}`}
                >
                  下载导入失败数据
                </a>
              </Col>
            </Fragment>
          ) : null}
        </Row>
      );
      /* eslint-enable */
    }
    return headerContent;
  };

  const { list, pagination, modalVisible, sendType, phone } = manageDetail;
  const modalProps = {
    title: '发送通知',
    visible: modalVisible,
    okText: '确定发送',
    destroyOnClose: true,
    confirmLoading: loading.effects['manageDetail/sendMessage'],
    onOk(values) {
      if (!values.length) {
        message.error('请至少选择一种通知方式');
        return;
      }
      const { single, multiple } = CONSTANTS.SENDTYPEMAPPING;
      switch (sendType) {
        case single:
          dispatch({
            type: 'manageDetail/sendMessage',
            payload: {
              url: Api.MANAGE.SEND_MESSAGE_WITH_CONDITION,
              phone,
              version,
              types: values,
            },
          });
          break;
        case multiple:
          dispatch({
            type: 'manageDetail/sendMessage',
            payload: {
              url: Api.MANAGE.SEND_MESSAGE,
              version,
              types: values,
            },
          });
          break;
        default:
          break;
      }
    },
    onCancel() {
      dispatch({
        type: 'manageDetail/hideModal',
      });
    },
  };
  const checkboxOptions = [
    {
      label: 'APP消息推送',
      value: 'app',
    },
    {
      label: '短信',
      value: 'message',
    },
    {
      label: '邮件',
      value: 'email',
    },
  ];
  return (
    <Fragment>
      <Card title="自动报销单管理单据">{generateHeaderContent()}</Card>
      <Table
        style={{ marginTop: 16 }}
        rowKey={record => record.id}
        columns={generateColumns()}
        dataSource={list}
        pagination={pagination}
        onChange={queryList}
      />
      <SendMessageModal {...modalProps} checkboxOptions={checkboxOptions} />
    </Fragment>
  );
};

ManageDetail.propTypes = {
  location: PropTypes.object,
  manageDetail: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({ manageDetail, loading }) => ({
  manageDetail,
  loading,
}))(ManageDetail);
