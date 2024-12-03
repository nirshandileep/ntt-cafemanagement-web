import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button, Form, Radio, Select, Space, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { API_BASE_URL } from '../pages/constants';
import axios from 'axios';

const AddEditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [cafes, setCafes] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    cafeId: null,
    gender: '',
  });

  useEffect(() => {
    fetchCafes();

    if (id) {
      setIsEditing(true);
      axios
        .get(`${API_BASE_URL}/employees/${id}`)
        .then((response) => {
          const employee = response.data;
          setEmployeeData(employee);
          form.setFieldsValue(employee);
        })
        .catch((error) => {
          console.error(error);
          notification.error({ message: 'Employee not found. Redirecting...' });
          navigate('/employees');
        });
    } else {
      setIsEditing(false);
      form.resetFields();
    }
  }, [id, form, navigate]);

  const fetchCafes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cafes/location`);
      setCafes(response.data);
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Failed to load cafes.' });
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/employees`, { ...values, id });
        notification.success({ message: 'Employee updated successfully!' });
      } else {
        await axios.post(`${API_BASE_URL}/employees`, values);
        notification.success({ message: 'Employee added successfully!' });
      }
      navigate('/employees');
    } catch (error) {
      let errorMessage = 'An error occurred';
      if (error.response && error.response.data) {
        const { title, detail, errors } = error.response.data;
        errorMessage = title || detail || JSON.stringify(errors);
      }

      notification.error({
        message: `Failed to ${isEditing ? 'update' : 'add'} employee`,
        description: errorMessage,
      });
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
      <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={employeeData}>
        {isEditing && (
          <Form.Item label="Employee ID" className="mb-2">
            <label>{id}</label>
          </Form.Item>
        )}

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter a name' }]}
          className="mb-2"
        >
          <Input className="w-50" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: 'email', required: true, message: 'Please enter a valid email address' }]}
          className="mb-2"
        >
          <Input className="w-50" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phoneNumber"
          rules={[{
            pattern: /^[89]\d{7}$/,
            required: true,
            message: 'Phone number must start with 8 or 9 and contain 8 digits',
          }]}
          className="mb-2"
        >
          <Input className="w-50" />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please select gender' }]}
          className="mb-2"
        >
          <Radio.Group className="w-50">
            <Radio value={1}>Male</Radio>
            <Radio value={2}>Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Cafe"
          name="cafeId"
          rules={[{ required: false }]} // Optional field
          className="mb-2"
        >
          <Select className="w-50" allowClear placeholder="Select a Cafe (Optional)">
            {cafes.map((cafe) => (
              <Select.Option key={cafe.id} value={cafe.id}>
                {cafe.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="mt-3">
          <Space>
            <Button type="primary" htmlType="submit">{isEditing ? 'Update Employee' : 'Add Employee'}</Button>
            <Button type="default" onClick={handleCancel}>Cancel</Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default AddEditEmployeePage;
