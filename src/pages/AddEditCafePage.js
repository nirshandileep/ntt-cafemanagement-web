import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button, Form, notification, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { API_BASE_URL } from '../pages/constants';


const AddEditCafePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id: '', name: '', description: '', location: '', logoUrl: '' });
  const [form] = useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      axios
        .get(`${API_BASE_URL}/cafes/${id}`)
        .then((response) => {
          const cafe = response.data;
          setFormData(cafe);
          form.setFieldsValue(cafe);
        })
        .catch((ex) => {
          console.log(ex);
          notification.error({ message: 'Cafe not found. Redirecting...' });
          navigate('/cafes');
        });
    } else {
      setFormData({ id: '', name: '', description: '', location: '', logoUrl: '' });
      form.resetFields();
    }
  }, [id, form, navigate]);

  const handleSubmit = async (values) => {
    const cafeDataPost = { ...values };
    const cafeData = { ...values, id: formData.id };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/cafes`, cafeData);
        notification.success({ message: 'Cafe updated successfully!' });
      } else {
        await axios.post(`${API_BASE_URL}/cafes`, cafeDataPost);
        notification.success({ message: 'Cafe added successfully!' });
      }
      navigate('/cafes');
    } catch (error) {
      notification.error({
        message: `Failed to ${isEditing ? 'update' : 'add'} cafe`,
        description: error.response?.data || 'An error occurred',
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEditing ? 'Edit Cafe' : 'Add New Cafe'}</h2>
      <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={formData}>
        <Form.Item
          label="Cafe Name"
          name="name"
          rules={[{ required: true, message: 'Please enter cafe name' }]}
          className="mb-2"
        >
          <Input className="w-50" />
        </Form.Item>

        <Form.Item
          label="Cafe Description"
          name="description"
          rules={[{ required: true, message: 'Please enter the description' }]}
          className="mb-2"
        >
          <Input.TextArea rows={4} className="w-50" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: 'Please enter the location' }]}
          className="mb-2"
        >
          <Input className="w-50" />
        </Form.Item>

        <Form.Item
          label="Logo URL"
          name="logoUrl"
          rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
          className="mb-2"
        >
          <Input className="w-50" />
        </Form.Item>

        <div className="mt-3">
          <Space>
            <Button type="primary" htmlType="submit">
              {isEditing ? 'Update Cafe' : 'Add Cafe'}
            </Button>
            <Button type="default" onClick={() => navigate('/cafes')}>
              Cancel
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default AddEditCafePage;
