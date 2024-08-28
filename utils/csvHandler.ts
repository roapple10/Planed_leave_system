import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

const CSV_FILE_PATH = './data/employees.csv';

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

export const readEmployees = (): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    const results: Employee[] = [];
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          id: data.ID || String(Date.now()), // 使用現有ID或生成新ID
          name: data.Name || '',
          email: data.Email || '',
          annualLeave: Number(data['Annual Leave']) || 0,
          remainingAnnualLeave: Number(data['Remaining Annual Leave']) || 0,
          sickLeave: Number(data['Sick Leave']) || 0,
          remainingSickLeave: Number(data['Remaining Sick Leave']) || 0,
          personalLeave: Number(data['Personal Leave']) || 0,
          remainingPersonalLeave: Number(data['Remaining Personal Leave']) || 0,
        });
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
};

export const writeEmployees = async (employees: Employee[]): Promise<void> => {
  const csvWriter = createObjectCsvWriter({
    path: CSV_FILE_PATH,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'annualLeave', title: 'Annual Leave' },
      { id: 'remainingAnnualLeave', title: 'Remaining Annual Leave' },
      { id: 'sickLeave', title: 'Sick Leave' },
      { id: 'remainingSickLeave', title: 'Remaining Sick Leave' },
      { id: 'personalLeave', title: 'Personal Leave' },
      { id: 'remainingPersonalLeave', title: 'Remaining Personal Leave' },
    ],
  });

  await csvWriter.writeRecords(employees);
};
