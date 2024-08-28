import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Alert } from '@mui/material';
import { getAuthUrl } from '../utils/googleCalendar';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
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

const LeaveRequest = () => {
  const router = useRouter();
  const [employeeName, setEmployeeName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    // Only run this effect when router.isReady is true
    if (!router.isReady) return;

    // Now it's safe to access router.query
    if (router.query.error) {
      setError('Google Calendar authorization failed. Please try again.');
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (employeeName && companyEmail) {
      fetchEmployeeInfo();
    }
  }, [employeeName, companyEmail]);

  const fetchEmployeeInfo = async () => {
    try {
      const response = await fetch('/api/employees');
      const employees = await response.json();
      const foundEmployee = employees.find(
        (emp: Employee) => emp.name === employeeName && emp.email === companyEmail
      );
      if (foundEmployee) {
        setEmployee(foundEmployee);
        setError(null);
      } else {
        setEmployee(null);
        setError('找不到匹配的員工資訊, 請填上正確的員工姓名與公司信箱');
      }
    } catch (error) {
      console.error('Error fetching employee info:', error);
      setError('獲取員工資訊時發生錯誤');
    }
  };

  const calculateLeaveDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const validateLeaveRequest = (leaveDuration: number) => {
    if (!employee) return '請先輸入有效的員工資訊';
    
    switch (leaveType) {
      case 'annualLeave':
        if (leaveDuration > employee.remainingAnnualLeave) {
          return '特休天數不足';
        }
        break;
      case 'sickLeave':
        if (leaveDuration > employee.remainingSickLeave) {
          return '病假天數不足';
        }
        break;
      case 'personalLeave':
        if (leaveDuration > employee.remainingPersonalLeave) {
          return '事假天數不足';
        }
        break;
      default:
        return '請選擇假別';
    }
    return null;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!employee) return;

    const leaveDuration = calculateLeaveDuration(startDate, endDate);
    const validationError = validateLeaveRequest(leaveDuration);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Update remaining leave days
      const response = await fetch('/api/leave-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employee.id,
          leaveType,
          startDate,
          endDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit leave request');
      }

      // Format dates for Google Calendar URL
      const formattedStartDate = format(new Date(startDate), "yyyyMMdd");
      const formattedEndDate = format(new Date(endDate), "yyyyMMdd");

      // Create Google Calendar event creation URL
      const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(`${employee.name} - ${leaveType}`)}&dates=${formattedStartDate}/${formattedEndDate}&details=${encodeURIComponent(`Leave request for ${employee.name}`)}&sf=true`;

      // Redirect to Google Calendar
      window.location.href = calendarUrl;
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setError('請假申請提交時發生錯誤');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Image src="/logo.png" alt="Admazes Logo" width={50} height={50} />
        <Typography variant="h4" component="h1" sx={{ ml: 2 }}>
          請假申請
        </Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={onSubmit}>
        <TextField
          label="員工姓名"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="公司信箱"
          type="email"
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {employee && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1">剩餘休假天數：</Typography>
            <Typography>特休：{employee.remainingAnnualLeave} 天</Typography>
            <Typography>病假：{employee.remainingSickLeave} 天</Typography>
            <Typography>事假：{employee.remainingPersonalLeave} 天</Typography>
          </Box>
        )}
        <FormControl fullWidth margin="normal">
          <InputLabel>假別</InputLabel>
          <Select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as string)}
            required
          >
            <MenuItem value="personalLeave">事假</MenuItem>
            <MenuItem value="sickLeave">病假</MenuItem>
            <MenuItem value="annualLeave">特休</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="開始日期"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="結束日期"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          提交申請
        </Button>
      </form>
    </Box>
  );
};

export default LeaveRequest;
