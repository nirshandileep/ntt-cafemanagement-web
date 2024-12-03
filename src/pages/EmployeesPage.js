import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { deleteEmployee } from '../redux/employeesSlice';
import { selectCafes } from '../redux/cafesSlice';
import { Button, Space, Modal, notification } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const EmployeesPage = () => {
  const { cafeId } = useParams();
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.items);
  const cafes = useSelector(selectCafes);

  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const filtered = cafeId ? employees.filter((emp) => emp.cafeId === cafeId) : employees;
    setFilteredEmployees(filtered);
  }, [cafeId, employees]);

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
    notification.success({ message: 'Employee deleted successfully' });
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
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

  const columns = [
    { headerName: 'Employee ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Email Address', field: 'email', sortable: true, filter: true },
    { headerName: 'Phone Number', field: 'phone', sortable: true, filter: true },
    { headerName: 'Days Worked', field: 'daysWorked', sortable: true, filter: true },
    {
      headerName: 'Café Name',
      valueGetter: (params) => {
        const cafe = cafes.find((cafe) => cafe.id === params.data.cafeId);
        return cafe ? cafe.name : 'Unknown Cafe';
      },
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 200,
      cellRendererFramework: (params) => {
        if (!params.data) return null;
        return (
          <Space>
            <Link to={`/edit-employee/${params.data.id}/${cafeId || ''}`}>
              <Button type="primary">Edit</Button>
            </Link>
            <Button
              type="danger"
              onClick={() => showDeleteConfirm(params.data.id)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="container">
      <h2 className="text-2xl font-semibold mb-4">Employees at {cafeId ? `Cafe ${cafeId}` : 'All Cafes'}</h2>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={filteredEmployees}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
      <div className="mt-4">
        <Link to={`/add-employee${cafeId ? `/${cafeId}` : ''}`}>
          <Button type="primary">Add New Employee</Button>
        </Link>
      </div>
    </div>
  );
};

export default EmployeesPage;
