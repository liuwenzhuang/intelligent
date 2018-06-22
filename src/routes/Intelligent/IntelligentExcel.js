import React, { Component } from 'react';
import { connect } from 'dva';
import { Upload, Tabs, Table, Button, Modal, Spin } from 'antd';
import { serverUrl } from '../../config';
import { getCookie } from '../../utils/utils';
import Constant from './Constants';
import styles from './index.less';
import { routerRedux } from 'dva/router';

const TabPane = Tabs.TabPane;

class IntelligentExcel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsKey: Constant.SETTYPES.OUTDATA, // 按部门 or 按用户
      uploading: false,
    };
    this.generateTable = this.generateTable.bind(this);
    this.handleTabsChange = this.handleTabsChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload({ file }) {
    const { status } = file;
    const { dispatch } = this.props;
    switch (status) {
      case 'uploading':
        this.setState({ uploading: true });
        return;
      case 'done':
        this.setState({ uploading: false });
        const {
          data: { information },
        } = file.response;
        Modal.confirm({
          title: '提示',
          content: information,
          okText: '查看详情',
          cancelText: '取消',
          iconType: 'check-circle',
          className: styles.confirmModal,
          onOk() {
            dispatch(
              routerRedux.push({
                pathname: '/manage',
              })
            );
          },
        });
        return;
      case 'error':
        this.setState({ uploading: false });
        const { code, detailMsg } = file.response;
        Modal.error({
          title: '失败',
          content: `${code}: ${detailMsg}`,
        });
        break;
      default:
        this.setState({ uploading: false });
        break;
    }
  }

  /**
   * 生成列表
   */
  generateTable() {
    const { tabsKey } = this.state;
    const { types, loading } = this.props;
    let dataSource = [];
    let columns = [];
    let loadingIndicator = false;
    switch (tabsKey) {
      case Constant.SETTYPES.OUTDATA:
        columns = [
          {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
              const tenantid = getCookie('tenantid');
              return (
                <Button
                  type="primary"
                  href={`${serverUrl}/exportExcel?id=${record.id}&tenantid=${tenantid}`}
                  target="_blank"
                >
                  导出数据格式文件
                </Button>
              );
            },
          },
          {
            title: '设置',
            dataIndex: 'set',
            key: 'set',
            render: (text, record) => {
              const tenantid = getCookie('tenantid');
              return (
                <Upload
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  action={`${serverUrl}/singleFileUpload?tenantid=${tenantid}`}
                  showUploadList={false}
                  onChange={this.handleUpload}
                  headers={{tenantid: getCookie('tenantid')}}
                >
                  <Button type="primary">导入数据文件</Button>
                </Upload>
              );
            },
          },
        ];
        dataSource = types;
        loadingIndicator = loading.effects['intelligentExcel/getBillType'];
        break;
      case Constant.SETTYPES.MONTHLY:
        // columns = Constant.TABLESETTINGS.MONTHLY.COLUMNS;
        // dataSource = userTable.list;
        // pagination = userTable.pagination;
        // loadingIndicator = loading.effects['ctrip/queryUserTable'];
        break;
      case Constant.SETTYPES.STANDARD:
        // columns=Constant.TABLESETTINGS.STANDARD.COLUMNS;
        break;
      default:
        break;
    }
    return (
      <Table
        rowKey={record => record.id}
        showHeader={false}
        loading={loadingIndicator}
        columns={columns}
        dataSource={dataSource}
        rowSelection={null}
        pagination={false}
      />
    );
  }

  /**
   * 标签页变化事件
   * @param {*} activeKey
   */
  handleTabsChange(activeKey) {
    this.setState({
      tabsKey: activeKey,
    });
  }

  render() {
    const tableContent = this.generateTable();
    const { uploading } = this.state;
    return (
      <div className={styles.ctrip}>
        <Tabs onChange={this.handleTabsChange}>
          <TabPane tab={Constant.TABHEADS.OUTDATA} key={Constant.SETTYPES.OUTDATA}>
            <div className={styles.panel}>{tableContent}</div>
          </TabPane>
          <TabPane tab={Constant.TABHEADS.MONTHLY} key={Constant.SETTYPES.MONTHLY}>
            <div className={styles.panel}>{tableContent}</div>
          </TabPane>
          <TabPane tab={Constant.TABHEADS.STANDARD} key={Constant.SETTYPES.STANDARD}>
            <div className={styles.panel}>{tableContent}</div>
          </TabPane>
        </Tabs>
        <Modal
          visible={uploading}
          maskClosable={false}
          keyboard={false}
          footer={null}
          closable={false}
        >
          <div className={styles.uploading}>
            <Spin />
            导入中...
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(({ intelligentExcel, loading }) => {
  return {
    types: intelligentExcel.types,
    loading: loading,
  };
})(IntelligentExcel);
