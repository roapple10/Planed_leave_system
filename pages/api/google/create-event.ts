import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { refreshToken, event } = req.body;

  if (!refreshToken || !event) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    console.log('Creating event:', event);

    const result = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    console.log('Event created:', result.data);

    res.status(200).json({ data: result.data });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: error.message || 'Failed to create event' });
  }
}