import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { addCafe, updateCafe } from '../redux/cafesSlice';
import { Input, Button, Form, Upload, notification, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';

const AddEditCafePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cafes = useSelector((state) => state.cafes.items);

  const [formData, setFormData] = useState({ id: '', name: '', description: '', logo: null, location: '' });
  const [form] = useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const cafeToEdit = cafes.find(cafe => cafe.id === id);
      if (cafeToEdit) {
        setIsEditing(true);
        setFormData(cafeToEdit);
        form.setFieldsValue(cafeToEdit);
      } else {
        notification.error({ message: 'Cafe not found. Redirecting...' });
        navigate('/cafes');
      }
    } else {
      setFormData({ id: uuidv4(), name: '', description: '', logo: null, location: '' });
      form.setFieldsValue({ id: uuidv4(), name: '', description: '', location: '' });
    }
  }, [id, cafes, form, navigate]);

  const handleFileChange = (file) => {
    setFormData((prevData) => ({ ...prevData, logo: file.originFileObj }));
    return false;
  };

  const handleSubmit = (values) => {
    const cafeData = { ...values, id: formData.id };

    if (isEditing) {
      dispatch(updateCafe(cafeData));
      notification.success({ message: 'Cafe updated successfully' });
    } else {
      dispatch(addCafe(cafeData));
      notification.success({ message: 'Cafe added successfully' });
    }
    navigate('/cafes');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEditing ? 'Edit Cafe' : 'Add New Cafe'}</h2>
      <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={formData}>
        <Form.Item label="Cafe Name" name="name" rules={[{ required: true, message: 'Please enter cafe name' }]} className="mb-2">
          <Input className="w-50" />
        </Form.Item>

        <Form.Item label="Cafe Description" name="description" className="mb-2">
          <Input.TextArea rows={4} className="w-50" />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please enter location' }]} className="mb-2">
          <Input className="w-50" />
        </Form.Item>

        <Form.Item label="Logo" name="logo" className="mb-2">
          <Upload customRequest={handleFileChange} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload Logo</Button>
          </Upload>
        </Form.Item>

        <div className="mt-3">
          <Space>
            <Button type="primary" htmlType="submit">{isEditing ? 'Update Cafe' : 'Add Cafe'}</Button>
            <Button type="default" onClick={() => navigate('/cafes')}>Cancel</Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default AddEditCafePage;
