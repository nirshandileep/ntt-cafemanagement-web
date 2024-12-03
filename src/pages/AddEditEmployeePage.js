import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { addEmployee, updateEmployee } from '../redux/employeesSlice';
import { Input, Button, Form, Radio, Select, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';

const AddEditEmployeePage = () => {
  const { id, cafeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employees = useSelector((state) => state.employees.items);
  const cafes = useSelector((state) => state.cafes.items);

  const [employeeData, setEmployeeData] = useState({
    id: uuidv4(),
    name: '',
    email: '',
    phone: '',
    daysWorked: '',
    cafeId: '',
    gender: '',
  });

  const [form] = useForm();

  useEffect(() => {
    if (id) {
      const employee = employees.find((emp) => emp.id === id);
      if (employee) {
        setEmployeeData(employee);
        form.setFieldsValue(employee);
      }
    } else {
      setEmployeeData({ id: uuidv4(), name: '', email: '', phone: '', daysWorked: '', cafeId: cafeId || '', gender: '' });
      form.setFieldsValue({ id: uuidv4(), name: '', email: '', phone: '', daysWorked: '', cafeId: cafeId || '', gender: '' });
    }
  }, [id, employees, cafeId, form]);

  const handleSubmit = (values) => {
    const data = { ...values, id: values.id || uuidv4() };
    if (id) {
      dispatch(updateEmployee(data));
    } else {
      dispatch(addEmployee(data));
    }

    navigate(`/employees/${cafeId || ''}`);
  };

  const handleCancel = () => {
    navigate(`/employees/${cafeId || ''}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{id ? 'Edit Employee' : 'Add New Employee'}</h2>
      
      <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={employeeData}>
        <Form.Item label="Employee ID" name="id" className="mb-2">
          <Input value={employeeData.id} readOnly className="w-50" />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, min: 6, max: 10, message: 'Name must be between 6 and 10 characters' }]}
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
          name="phone"
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
          label="Days Worked"
          name="daysWorked"
          rules={[{ required: true, message: 'Please enter the number of days worked' }]}
          className="mb-2"
        >
          <Input type="number" className="w-50" />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please select gender' }]}
          className="mb-2"
        >
          <Radio.Group className="w-50">
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Cafe"
          name="cafeId"
          rules={[{ required: true, message: 'Please select a café' }]}
          className="mb-2"
        >
          <Select className="w-50">
            {cafes.map((cafe) => (
              <Select.Option key={cafe.id} value={cafe.id}>{cafe.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="mt-3">
          <Space>
            <Button type="primary" htmlType="submit">{id ? 'Update Employee' : 'Add Employee'}</Button>
            <Button type="default" onClick={handleCancel}>Cancel</Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default AddEditEmployeePage;
