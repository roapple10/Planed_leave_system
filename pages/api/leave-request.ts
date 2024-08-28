import { NextApiRequest, NextApiResponse } from 'next';
import { readEmployees, writeEmployees } from '../../utils/csvHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { employeeId, leaveType, startDate, endDate } = req.body;

    try {
      const employees = await readEmployees();
      const employeeIndex = employees.findIndex(emp => emp.id === employeeId);

      if (employeeIndex === -1) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const leaveDuration = calculateLeaveDuration(startDate, endDate);
      const remainingLeaveField = `remaining${capitalizeFirstLetter(leaveType)}` as keyof typeof employees[0];
      
      if (employees[employeeIndex][remainingLeaveField] < leaveDuration) {
        return res.status(400).json({ error: 'Insufficient leave balance' });
      }

      // Update remaining leave
      employees[employeeIndex][remainingLeaveField] -= leaveDuration;

      // Write updated employees data back to CSV
      await writeEmployees(employees);

      res.status(200).json({ message: 'Leave request approved and remaining leave updated' });
    } catch (error) {
      console.error('Error processing leave request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function calculateLeaveDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
