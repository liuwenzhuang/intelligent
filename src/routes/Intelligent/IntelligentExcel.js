import React, { Component } from 'react';
import { connect } from 'dva';
import { Upload, Tabs, Table, Button } from 'antd';
import { serverUrl } from '../../config';
import Constant from './Constants';
import styles from './index.less';

const TabPane = Tabs.TabPane;

class IntelligentExcel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsKey: Constant.SETTYPES.OUTDATA, // 按部门 or 按用户
    };
    this.generateTable = this.generateTable.bind(this);
    this.handleTabsChange = this.handleTabsChange.bind(this);
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
              return (
                <Button
                  type="primary"
                  href={`${serverUrl}/exportExcel?id=${record.id}`}
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
              return (
                <Upload
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  action={`${serverUrl}/singleFileUpload`}
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
