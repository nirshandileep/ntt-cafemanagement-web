import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { CoffeeOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import CafesPage from './pages/CafesPage';
import EmployeesPage from './pages/EmployeesPage';
import AddEditCafePage from './pages/AddEditCafePage';
import AddEditEmployeePage from './pages/AddEditEmployeePage';

import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Sider, Content } = Layout;
const { Title } = Typography;

const App = () => {
  return (
    <Layout className="min-vh-100">
      {/* Left Sidebar */}
      <Sider width={200} className="site-layout-background">
        <div className="p-3 text-center">
          <Link to="/" className="text-white text-decoration-none">
            <Title level={3} className="mb-0 text-white">Café App</Title>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
        >
          <Menu.Item key="1" icon={<CoffeeOutlined />}>
            <Link to="/cafes">Cafes</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UsergroupAddOutlined />}>
            <Link to="/employees">Employees</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Right Content Area */}
      <Layout className="ps-3 pe-3">
        <Content className="pt-3 pb-3">
          {/* Page Content */}
          <div>
            <Routes>
              <Route path="/" element={<CafesPage />} />
              <Route path="/cafes" element={<CafesPage />} />
              <Route path="/add-cafe" element={<AddEditCafePage />} />
              <Route path="/edit-cafe/:id" element={<AddEditCafePage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:cafeId" element={<EmployeesPage />} />
              <Route path="/add-employee" element={<AddEditEmployeePage />} />
              <Route path="/add-employee/:cafeId" element={<AddEditEmployeePage />} />
              <Route path="/edit-employee/:id" element={<AddEditEmployeePage />} />
              <Route path="/edit-employee/:id/:cafeId" element={<AddEditEmployeePage />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
