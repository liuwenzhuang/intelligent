import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import CONSTANTS from './Constants';
import { stringify } from 'qs';
import { serverUrl, Api } from '../../config';

const List = ({ onOpenDetail, ...tableProps }) => {
  const columns = [
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
        return successCount == 0 ? (
          <span>{successCount}</span>
        ) : (
          <a href="javascript:void(0)" onClick={() => onOpenDetail(record, CONSTANTS.SUCCESS)}>
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
          <a href="javascript:void(0)" onClick={() => onOpenDetail(record, CONSTANTS.FAILURE)}>
            {failureCount}
          </a>
        );
      },
      /* eslint-enable */
    },
    {
      title: '导入时间',
      dataIndex: 'createTime',
      key: 'createTime',
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

  return (
    <Table
      {...tableProps}
      rowKey={record => record.id}
      columns={columns}
    />
  );
};

List.propTypes = {
  onOpenDetail: PropTypes.func,
};

export default List;
