import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Table, Button, Space, Modal, notification } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_BASE_URL } from '../pages/constants';

const EmployeesPage = () => {
  const { cafeId } = useParams();
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cafeName, setCafeName] = useState(location.state?.cafeName || '');

  useEffect(() => {
    fetchEmployees(cafeId);
  }, [cafeId]);

  const fetchEmployees = async (cafe) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`, {
        params: { cafe },
      });
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        handleDelete(id);
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/employees/${id}`);
      notification.success({ message: 'Employee deleted successfully' });
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));
    } catch (error) {
      notification.error({
        message: 'Error deleting employee',
        description: error.response?.data || 'An error occurred',
      });
    }
  };

  const columns = [
    { title: 'Employee ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email Address', dataIndex: 'emailAddress', key: 'emailAddress' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'Days Worked', dataIndex: 'daysWorked', key: 'daysWorked' },
    { title: 'Cafe', dataIndex: 'cafe', key: 'cafe' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Link to={`/edit-employee/${record.id}/${cafeId || ''}`}>
            <Button type="primary" icon={<EditOutlined />}>
              Edit
            </Button>
          </Link>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Employees {cafeId && `at ${cafeName}`}
      </h2>
      {employees.length === 0 ? (
        <p>No employees found</p>
      ) : (
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          pagination
          scroll={{ x: 'max-content' }}
        />
      )}
      <div className="mt-4">
        <Link to={`/add-employee${cafeId ? `/${cafeId}` : ''}`}>
          <Button type="primary">Add New Employee</Button>
        </Link>
      </div>
    </div>
  );
  
};

export default EmployeesPage;
