import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Space, Input, notification } from 'antd';
import { Link } from 'react-router-dom';
import { deleteCafe } from '../redux/cafesSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { selectCafes } from '../redux/cafesSlice';

const { Search } = Input;

const CafesPage = () => {
  const dispatch = useDispatch();
  const cafes = useSelector(selectCafes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCafes, setFilteredCafes] = useState(cafes);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    try {
      // Logic to fetch cafes data can be added here if required
    } catch (err) {
      setError('Failed to load cafes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filteredData = cafes.filter(
      (cafe) => cafe.location.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredCafes(filteredData);
  }, [searchTerm, cafes]);

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
      onCancel: () => {
        console.log('Delete cancelled');
      },
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    dispatch(deleteCafe(id));
    notification.success({ message: 'Cafe deleted successfully' });
  };

  const columns = [
    { title: 'Cafe ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'View Employees',
      key: 'viewEmployees',
      render: (text, record) => (
        <Link to={`/employees/${record.id}`}>
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
