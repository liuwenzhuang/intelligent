import React, { Component } from 'react';
import { connect } from 'dva';
import { Upload, Tabs, Select, Table, Button, Form, Row, Col, Input, Modal } from 'antd';
import Constant from './Constants';
import styles from './index.less';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Search = Input.Search;

class IntelligentExcel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsKey: Constant.SETTYPES.OUTDATA, // 按部门 or 按用户
      orgpk: '', // 选择的组织pk
      selectedRowKeys: [], // 多选的表格项
      selectedRows: [],
    };
    this.handleOrgChange = this.handleOrgChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.generateOrgDorpDown = this.generateOrgDorpDown.bind(this);
    this.generateSearchForm = this.generateSearchForm.bind(this);
    this.handleOperation = this.handleOperation.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.generateTable = this.generateTable.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handleTabsChange = this.handleTabsChange.bind(this);
    this.handleBatchModify = this.handleBatchModify.bind(this);
    this.hideModal = this.hideModal.bind(this);
    // this.generateModalTable = this.generateModalTable.bind(this);
    this.handleModalTableChange = this.handleModalTableChange.bind(this);
    // this.handleModalTableSearch = this.handleModalTableSearch.bind(this);

    this.singleSelectRow = null; // 点击某行修改按钮时，保存此行数据
    this.singleAuthorize = false; // 单/多 选修改授权人
  }

  /**
   * 组织变化事件
   * @param {*} value
   */
  handleOrgChange(value) {
    this.setState(
      {
        orgpk: value,
      },
      () => {
        this.handleSearch();
      }
    );
  }

  /**
   * 表格搜索事件
   * @param {} e
   */
  handleSearch(e) {
    e && e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const { searchStr } = fieldsValue;
      const { orgpk } = this.state;
      const { dispatch } = this.props;
      const { tabsKey } = this.state;
      let type =
        'ctrip/' + (tabsKey === Constant.SETTYPES.DEPT ? 'queryDeptTable' : 'queryUserTable');
      dispatch({
        type,
        payload: {
          condition: searchStr,
          orgpk,
          current: 1,
          pageSize: 10,
        },
      });
    });
  }

  /**
   * 左上角组织下拉
   */
  generateOrgDorpDown() {
    const { orgs } = this.props;
    return (
      <Select
        showSearch
        style={{ width: 152 }}
        placeholder="组织"
        optionFilterProp="children"
        onChange={this.handleOrgChange}
        filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {orgs &&
        orgs.length &&
        orgs.map(org => (
          <Option key={org['pk']} value={org['pk']}>
            {org['name']}
          </Option>
        ))}
      </Select>
    );
  }

  generateSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('searchStr')(<Search placeholder="请输入搜索内容" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * 表格项的操作事件
   * @param {*} record
   */
  handleOperation(record) {
    this.singleSelectRow = record;
    this.singleAuthorize = true;
    const { dispatch } = this.props;
    const { orgpk } = this.state;
    dispatch({
      type: 'ctrip/showModal',
    });
    dispatch({
      type: 'ctrip/queryAuthorizerTable',
      payload: {
        current: 1,
        pageSize: 10,
        orgpk,
      },
    });
  }

  /**
   * 选择表格项
   * @param {*} selectedRowKeys
   */
  handleSelectChange(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  handleTableChange(pagination, filters, sorter) {
    const { current, pageSize } = pagination;
    const { dispatch, form } = this.props;
    const { tabsKey, orgpk } = this.state;
    let type =
      'ctrip/' + (tabsKey === Constant.SETTYPES.DEPT ? 'queryDeptTable' : 'queryUserTable');
    let searchStr = form.getFieldValue('searchStr');
    searchStr = searchStr && searchStr.trim();
    dispatch({
      type,
      payload: {
        current,
        pageSize,
        condition: searchStr,
        orgpk,
      },
    });
  }

  handleImport({ id }) {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'intelligentExcel/export',
    //   payload: {
    //     id,
    //     url: Api.INTELLIGENTEXCEL.EXPORT
    //   }
    // });
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
                  href={`http://localhost:8090/exportExcel?id=${record.id}`}
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
                  action="http://localhost:8090/singleFileUpload"
                >
                  <Button type="primary" onclick={this.handleImport.bind(this, record)}>
                    导入数据文件
                  </Button>
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
    // columns[columns.length - 1]['render'] = (text, record) => (
    //   <span>
    //     {
    //       // eslint-disable-next-line
    //       <a href="javascript:void(0);" onClick={this.handleOperation.bind(this, record)}>
    //         修改
    //       </a>
    //     }
    //   </span>
    // );
    // pagination = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   ...pagination,
    // };
    return (
      <Table
        showHeader={false}
        loading={loadingIndicator}
        columns={columns}
        dataSource={dataSource}
        rowSelection={null}
        pagination={false}
        onChange={this.handleTableChange}
      />
    );
  }

  /**
   * 标签页变化事件
   * @param {*} activeKey
   */
  handleTabsChange(activeKey) {
    this.setState(
      {
        tabsKey: activeKey,
        selectedRowKeys: [],
        selectedRows: [],
      },
      () => {
        this.handleSearch();
      }
    );
  }

  /**
   * 批量修改
   */
  handleBatchModify() {
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys || !selectedRowKeys.length) {
      Modal.info({
        title: '提示',
        content: '请选择部门或人员信息后进行操作',
        onOk() {},
      });
      return;
    }
    this.singleAuthorize = false;
    const { dispatch } = this.props;
    const { orgpk } = this.state;
    dispatch({
      type: 'ctrip/showModal',
    });
    dispatch({
      type: 'ctrip/queryAuthorizerTable',
      payload: {
        current: 1,
        pageSize: 10,
        orgpk,
      },
    });
  }

  /**
   * 弹出表格的变化事件
   * @param {*} pagination
   * @param {*} filters
   * @param {*} sorter
   * @param {*} searchStr
   */
  handleModalTableChange(pagination, filters, sorter, searchStr = '') {
    const { current, pageSize } = pagination;
    const { dispatch } = this.props;
    const { orgpk } = this.state;
    dispatch({
      type: 'ctrip/queryAuthorizerTable',
      payload: {
        current,
        pageSize,
        orgpk,
        condition: searchStr,
      },
    });
  }

  /**
   * 弹出表格的搜索事件
   * @param {*} searchStr
   */
  // handleModalTableSearch(searchStr = '') {
  //   const { dispatch } = this.props;
  //   const { orgpk } = this.state;
  //   dispatch({
  //     type: 'ctrip/queryAuthorizerTable',
  //     payload: {
  //       current: 1,
  //       pageSize: 10,
  //       orgpk,
  //       condition: searchStr,
  //     },
  //   });
  // }

  // setAsAuthorizer(record) {
  //   const { tabsKey, selectedRows, orgpk } = this.state;
  //   const { dispatch } = this.props;
  //   let type = '';
  //   let payload = {};
  //   switch (tabsKey) {
  //     case Constant.SETTYPES.DEPT:
  //       type = 'ctrip/updatedeptauth';
  //       payload = {
  //         depts: this.singleAuthorize ? [this.singleSelectRow] : selectedRows,
  //         ...record,
  //         orgpk,
  //       };
  //       break;
  //     case Constant.SETTYPES.USER:
  //       type = 'ctrip/updateuserauth';
  //       payload = {
  //         users: this.singleAuthorize ? [this.singleSelectRow] : selectedRows,
  //         ...record,
  //         orgpk,
  //       };
  //       break;
  //     default:
  //       break;
  //   }
  //   dispatch({
  //     type,
  //     payload,
  //   })
  //     .then(() => {
  //       Modal.info({
  //         title: '修改成功',
  //         content: '修改授权人成功',
  //         onOk: () => {
  //           this.hideModal();
  //           this.handleSearch();
  //         },
  //       });
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // }

  hideModal() {
    this.props.dispatch({
      type: 'ctrip/hideModal',
    });
  }

  render() {
    const orgDropDown = this.generateOrgDorpDown();
    const searchForm = this.generateSearchForm();
    const tableContent = this.generateTable();
    return (
      <div className={styles.ctrip}>
        <Tabs tabBarExtraContent={orgDropDown} onChange={this.handleTabsChange}>
          <TabPane tab={Constant.TABHEADS.OUTDATA} key={Constant.SETTYPES.OUTDATA}>
            <div className={styles.panel}>{tableContent}</div>
          </TabPane>
          <TabPane tab={Constant.TABHEADS.MONTHLY} key={Constant.SETTYPES.MONTHLY}>
            <div className={styles.panel}>
              {searchForm}
              {tableContent}
            </div>
          </TabPane>
          <TabPane tab={Constant.TABHEADS.STANDARD} key={Constant.SETTYPES.STANDARD}>
            <div className={styles.panel}>
              {searchForm}
              {tableContent}
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(({ intelligentExcel, loading, ...rest }) => {
  return {
    types: intelligentExcel.types,
    loading: loading,
  };
})(Form.create({})(IntelligentExcel));
