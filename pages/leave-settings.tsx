import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';

interface Employee {
  id: string;
  name: string;
  email: string;
  annualLeave: number;
  remainingAnnualLeave: number;
  sickLeave: number;
  remainingSickLeave: number;
  personalLeave: number;
  remainingPersonalLeave: number;
}

const LeaveSettings = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: '',
    name: '',
    email: '',
    annualLeave: 0,
    remainingAnnualLeave: 0,
    sickLeave: 0,
    remainingSickLeave: 0,
    personalLeave: 0,
    remainingPersonalLeave: 0,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const updateEmployee = (id: string, field: keyof Employee, value: string | number) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, [field]: value } : emp
    ));
  };

  const saveEmployee = async (id: string) => {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employees),
      });
      if (!response.ok) {
        throw new Error('Failed to update employees');
      }
      // 可以添加一個成功提示
    } catch (error) {
      console.error('Error updating employees:', error);
      // 可以添加一個錯誤提示
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const response = await fetch(`/api/employees?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleAddEmployee = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewEmployee({
      id: '',
      name: '',
      email: '',
      annualLeave: 0,
      remainingAnnualLeave: 0,
      sickLeave: 0,
      remainingSickLeave: 0,
      personalLeave: 0,
      remainingPersonalLeave: 0,
    });
  };

  const handleSaveNewEmployee = async () => {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...employees, { ...newEmployee, id: Date.now().toString() }]),
      });
      if (!response.ok) {
        throw new Error('Failed to add new employee');
      }
      setEmployees([...employees, { ...newEmployee, id: Date.now().toString() }]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding new employee:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Image src="/logo.png" alt="Admazes Logo" width={50} height={50} />
          <Typography variant="h4" component="h1" sx={{ ml: 2 }}>
            員工休假設定
          </Typography>
        </Box>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddEmployee}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          新增員工
        </Button>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>員工姓名</TableCell>
                <TableCell>員工信箱</TableCell>
                <TableCell>特休天數</TableCell>
                <TableCell>剩餘特休天數</TableCell>
                <TableCell>病假天數</TableCell>
                <TableCell>剩餘病假天數</TableCell>
                <TableCell>事假天數</TableCell>
                <TableCell>剩餘事假天數</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <TextField
                      value={employee.name}
                      onChange={(e) => updateEmployee(employee.id, 'name', e.target.value)}
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={employee.email}
                      onChange={(e) => updateEmployee(employee.id, 'email', e.target.value)}
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={employee.annualLeave}
                      onChange={(e) => updateEmployee(employee.id, 'annualLeave', Number(e.target.value))}
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={employee.remainingAnnualLeave}
                      onChange={(e) => updateEmployee(employee.id, 'remainingAnnualLeave', Number(e.target.value))}
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={employee.sickLeave}
                      onChange={(e) => updateEmployee(employee.id, 'sickLeave', Number(e.target.value))}
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={employee.remainingSickLeave}
                      onChange={(e) => updateEmployee(employee.id, 'remainingSickLeave', Number(e.target.value))}
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={employee.personalLeave}
                      onChange={(e) => updateEmployee(employee.id, 'personalLeave', Number(e.target.value))}
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={employee.remainingPersonalLeave}
                      onChange={(e) => updateEmployee(employee.id, 'remainingPersonalLeave', Number(e.target.value))}
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      startIcon={<SaveIcon />}
                      onClick={() => saveEmployee(employee.id)}
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      保存
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteEmployee(employee.id)}
                      variant="contained"
                      color="error"
                      size="small"
                    >
                      刪除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>新增員工</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="員工姓名"
              fullWidth
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="員工信箱"
              fullWidth
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            />
            <TextField
              margin="dense"
              label="特休天數"
              type="number"
              fullWidth
              value={newEmployee.annualLeave}
              onChange={(e) => setNewEmployee({ ...newEmployee, annualLeave: Number(e.target.value), remainingAnnualLeave: Number(e.target.value) })}
            />
            <TextField
              margin="dense"
              label="病假天數"
              type="number"
              fullWidth
              value={newEmployee.sickLeave}
              onChange={(e) => setNewEmployee({ ...newEmployee, sickLeave: Number(e.target.value), remainingSickLeave: Number(e.target.value) })}
            />
            <TextField
              margin="dense"
              label="事假天數"
              type="number"
              fullWidth
              value={newEmployee.personalLeave}
              onChange={(e) => setNewEmployee({ ...newEmployee, personalLeave: Number(e.target.value), remainingPersonalLeave: Number(e.target.value) })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>取消</Button>
            <Button onClick={handleSaveNewEmployee}>保存</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default LeaveSettings;
