import { NextApiRequest, NextApiResponse } from 'next';
import { addEventToGoogleCalendar } from '../../utils/googleCalendar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { summary, description, startDate, endDate, authCode } = req.body;

    if (!authCode) {
      return res.status(400).json({ error: 'Authorization code is missing' });
    }

    try {
      const eventLink = await addEventToGoogleCalendar(summary, description, startDate, endDate, authCode);
      res.status(200).json({ eventLink });
    } catch (error) {
      console.error('Error adding event to Google Calendar:', error);
      res.status(500).json({ error: 'Failed to add event to Google Calendar' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
