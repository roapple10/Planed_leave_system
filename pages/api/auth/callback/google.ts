import type { NextApiRequest, NextApiResponse } from 'next'
import { addEventToGoogleCalendar } from '../../../../utils/googleCalendar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query;

  if (typeof code !== 'string' || typeof state !== 'string') {
    return res.status(400).json({ error: 'Missing code or state parameter' });
  }

  try {
    const { summary, description, startDate, endDate } = JSON.parse(decodeURIComponent(state));

    const eventLink = await addEventToGoogleCalendar(summary, description, startDate, endDate, code);

    res.redirect(`/leave-request?success=true&eventLink=${encodeURIComponent(eventLink)}`);
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    res.redirect('/leave-request?error=Failed to add event to calendar');
  }
}
