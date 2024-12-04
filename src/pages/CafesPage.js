import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Space, Input, notification } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_BASE_URL } from '../pages/constants';

const { Search } = Input;

const CafesPage = () => {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer); // Cleanup timeout on unmount or input change
  }, [searchTerm]);

  useEffect(() => {
    fetchCafes(debouncedSearchTerm); // Fetch data only when debouncedSearchTerm changes
  }, [debouncedSearchTerm]);

  const fetchCafes = async (location = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/cafes/location`, {
        params: { location },
      });
      setCafes(response.data);
      setFilteredCafes(response.data);
    } catch (err) {
      setError('Failed to load cafes.');
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/cafes/${id}`);
      notification.success({ message: 'Cafe deleted successfully' });
      setCafes((prevCafes) => prevCafes.filter((cafe) => cafe.id !== id));
      setFilteredCafes((prevCafes) => prevCafes.filter((cafe) => cafe.id !== id));
    } catch (error) {
      notification.error({
        message: 'Error deleting cafe',
        description: error.response?.data || 'An error occurred',
      });
    }
  };

  const columns = [
    { title: 'Cafe ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Employees', dataIndex: 'employees', key: 'employees' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'View Employees',
      key: 'viewEmployees',
      render: (text, record) => (
        <Link
          to={`/employees/${record.id}`}
          state={{ cafeName: record.name }}
        >
          <Button type="default" icon={<EditOutlined />} className="mr-2">
            View Employees
          </Button>
        </Link>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Link to={`/edit-cafe/${record.id}`}>
            <Button type="primary" icon={<EditOutlined />}>Edit</Button>
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
      <h2 className="text-2xl font-semibold mb-4">Cafes</h2>
      <div className="mb-4">
        <Search
          placeholder="Search by location"
          onChange={handleSearchChange}
          value={searchTerm}
          enterButton
          allowClear
        />
      </div>

      {filteredCafes.length === 0 ? <p>No cafes found</p> : (
        <Table
          columns={columns}
          dataSource={filteredCafes}
          rowKey="id"
          pagination
          scroll={{ x: 'max-content' }}
        />
      )}

      <div className="mt-4">
        <Link to="/add-cafe">
          <Button type="primary">Add New Cafe</Button>
        </Link>
      </div>
    </div>
  );
};

export default CafesPage;
