import type { NextApiRequest, NextApiResponse } from 'next'
import { readEmployees, writeEmployees } from '../../utils/csvHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const employees = await readEmployees()
      res.status(200).json(employees)
    } catch (error) {
      console.error('Error reading employees:', error)
      res.status(500).json({ error: 'Error reading employee data' })
    }
  } else if (req.method === 'POST') {
    try {
      const employees = req.body
      await writeEmployees(employees)
      res.status(200).json({ message: 'Employees updated successfully' })
    } catch (error) {
      console.error('Error writing employees:', error)
      res.status(500).json({ error: 'Error updating employee data' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      const employees = await readEmployees()
      const updatedEmployees = employees.filter(emp => emp.id !== id)
      await writeEmployees(updatedEmployees)
      res.status(200).json({ message: 'Employee deleted successfully' })
    } catch (error) {
      console.error('Error deleting employee:', error)
      res.status(500).json({ error: 'Error deleting employee' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
