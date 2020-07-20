import React, { Component } from 'react'
import './App.css';
import { Layout, Row, Col, Button, Table, Modal, Form, Input, Space, message, Popconfirm } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Header, Footer, Content } = Layout;
const { Column } = Table;
const { TextArea } = Input;

class App extends Component {
  state = { 
    addVisible: false,
    lookVisible: false,
    editVisible: false,
    taskkey: '',
    taskname: '',
    taskdetail: '',
    data: [ // 表格数据
      
    ]
  };

  showaddModal = () => {
    this.setState({
      addVisible: true,
    });
  };

  showlookModal = e => {
    console.log(e)
    this.setState({
      lookVisible: true,
      taskname: e.name,
      taskdetail: e.detail,
    });
  }

  showeditModal = e => {
    this.setState({
      editVisible: true,
      taskkey: e.key,
      taskname: e.name,
      taskdetail: e.detail,
    });
  }

  addHandleOk = e => {
    console.log(e);
    if (this.state.taskname === '') {
      message.warning('please enter your taskname');
    } else {
      if (this.state.taskdetail === '') {
        message.warning('please enter your taskdetail');
      } else {
          let newdata = []
          let num = 0
        if (window.localStorage.getItem('taskdata')) {
          newdata = JSON.parse(window.localStorage.getItem('taskdata'))
          num = newdata[0].key
          if (newdata.length === 1) {
            num = newdata[0].key + 1
          } else {
            for (let i = 0; i < newdata.length - 1; i++) {
              num = num < newdata[i+1].key ? newdata[i+1].key : num
            }
          }
        }
        
        newdata.push({
          key: num + 1,
          name: this.state.taskname,
          detail: this.state.taskdetail
        })
        window.localStorage.setItem('taskdata', JSON.stringify(newdata))
        this.setState({
          addVisible: false,
          data: newdata,
        });
        message.success('Successfully insert');
      }
    }
  };

  getTaskName (e) {
    this.setState({
      taskname: e.target.value,
    });
  }

  getTaskDetail (e) {
    this.setState({
      taskdetail: e.target.value,
    });
  }

  lookHandleOk = e => {
    console.log(e);
    this.setState({
      lookVisible: false,
    });
  };

  editHandleOk = e => {
    console.log(e);
    console.log(this.state.taskkey)
    console.log(this.state.taskname)
    console.log(this.state.taskdetail)
    if (this.state.taskname === '') {
      message.warning('please enter your taskname');
    } else {
      if (this.state.taskdetail === '') {
        message.warning('please enter your taskdetail');
      } else {
        let newdata = JSON.parse(window.localStorage.getItem('taskdata'))
        newdata.map(data => {
          if (data.key === this.state.taskkey) {
            data.name = this.state.taskname
            data.detail = this.state.taskdetail
          }
          return 0
        })
        window.localStorage.setItem('taskdata', JSON.stringify(newdata))
        this.setState({
          editVisible: false,
          data: newdata,
        });
        message.success('Successfully update');
      }
    }
  };

  addHandleCancel = e => {
    console.log(e);
    this.setState({
      addVisible: false,
    });
    this.setState({
      taskname: '',
      taskdetail: '',
    })
  };

  lookHandleCancel = e => {
    console.log(e);
    this.setState({
      lookVisible: false,
    });
  }

  editHandleCancel = e => {
    console.log(e);
    this.setState({
      editVisible: false,
    });
  };

  deleteConfirm = e => {
    let newdata = JSON.parse(window.localStorage.getItem('taskdata'))
    for (let i = 0; i < newdata.length; i++) {
      if (newdata[i].key === e.key) {
        newdata.splice(i, 1)
      }
    }
    window.localStorage.setItem('taskdata', JSON.stringify(newdata))
    this.setState({
      data: newdata,
    });
    message.success('Successfully deleted');
  }
  
  componentDidMount() {
    if (window.localStorage.getItem('taskdata')) {
      let newdata = JSON.parse(window.localStorage.getItem('taskdata'))
      this.setState({
        data: newdata,
      });
    }
  }

  render() {
    return (
      <Layout>
        <Header>待办事项管理</Header>
        <Content>
          <Row>
            <Col span = {16} offset = {4}>
              <Button type = "primary" onClick={ this.showaddModal } icon = {<SearchOutlined />} style = {{ margin: "10px 0px 10px 0px" }}>
                新增事项
              </Button>
              <Table dataSource = {this.state.data}>
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="Detail" dataIndex="detail" key="detail" ellipsis="true" />
                <Column title="Action"
                        key="action" 
                        render={(text, record) => (
                          <Space size="middle">
                            <a href="/#" onClick={ () => this.showlookModal(record) }>查看</a>
                            <a href="/#" onClick={ () => this.showeditModal(record) }>编辑</a>
                            <Popconfirm
                              title="Are you sure delete this task?"
                              onConfirm={ () => this.deleteConfirm(record) }
                              okText="Yes"
                              cancelText="No"
                            >
                              <a href="/#" >删除</a>
                            </Popconfirm>
                          </Space>
                        )}
                />
              </Table>
            </Col>
          </Row>
        </Content>
        {/* 新增模态框 */}
        <Modal
          title="新增事项"
          visible={ this.state.addVisible }
          destroyOnClose="true"
          onOk={ this.addHandleOk }
          onCancel={ this.addHandleCancel }
        >
          <Form
            name="addForm"
          >
            <Form.Item
              label="taskname"
              name="taskname"
              rules={[{ required: true }]}
            >
              <Input ref='taskname' onChange={ this.getTaskName.bind(this) } />
            </Form.Item>
            <Form.Item
              label="taskdetail"
              name="taskdetail"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} ref='taskdetail' onChange={ this.getTaskDetail.bind(this) } />
            </Form.Item>
          </Form>
        </Modal>
        {/* 查看模态框 */}
        <Modal
          title="查看事项"
          visible={ this.state.lookVisible }
          destroyOnClose="true"
          onOk={ this.lookHandleOk }
          onCancel={ this.lookHandleCancel }
          footer={[
              <Button key="submit" type="primary" onClick={ this.lookHandleOk }>
                  OK  
              </Button>,
            ]}

        >
          <Form
            name="lookForm"
          >
            <Form.Item
              label="taskname"
              rules={[{ required: true }]}
            >
              <Input defaultValue={this.state.taskname} disabled />
            </Form.Item>
            <Form.Item
              label="taskdetail"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} defaultValue={this.state.taskdetail} disabled />
            </Form.Item>
          </Form>
        </Modal>
        {/* 编辑模态框 */}
        <Modal
          title="编辑事项"
          visible={ this.state.editVisible }
          destroyOnClose="true"
          onOk={ this.editHandleOk }
          onCancel={ this.editHandleCancel }
          footer={[
            <Button key="back" onClick={ this.editHandleCancel }>
              Cancel  
            </Button>,
            <Popconfirm
              title="Are you sure to save this task?"
              onConfirm={ () => this.editHandleOk() }
              okText="Yes"
              cancelText="No"
            >
              <Button key="submit" type="primary" >
                OK  
              </Button>
            </Popconfirm>,
          ]}
        >
          <Form
            name="editForm"
          >
            <Form.Item
              label="taskname"
              rules={[{ required: true }]}
            >
              <Input defaultValue={this.state.taskname} onChange={ this.getTaskName.bind(this) } />
            </Form.Item>
            <Form.Item
              label="taskdetail"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} defaultValue={this.state.taskdetail} onChange={ this.getTaskDetail.bind(this) } />
            </Form.Item>
          </Form>
        </Modal>
        <Footer></Footer>
      </Layout>
    )
  }
}

export default App;
