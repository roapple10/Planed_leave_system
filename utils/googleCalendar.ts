import { OAuth2Client } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || '';

export const getAuthUrl = async () => {
  const response = await fetch('/api/google/auth');
  const { url } = await response.json();
  return url;
};

// Only use this function server-side
export async function addEventToGoogleCalendar(summary: string, description: string, startDate: string, endDate: string, code: string) {
  if (typeof window !== 'undefined') {
    throw new Error('This function should only be called server-side');
  }

  const { google } = await import('googleapis');
  const { OAuth2Client } = await import('google-auth-library');
  
  const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Store the refresh token in your database associated with the user
  const refreshToken = tokens.refresh_token;

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const event = {
    summary,
    description,
    start: {
      date: startDate,
    },
    end: {
      date: endDate,
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    console.log('Event created: %s', response.data.htmlLink);
    return response.data.htmlLink;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

// Remove or comment out these console.log statements
// console.log('CLIENT_ID:', CLIENT_ID);
// console.log('CLIENT_SECRET:', CLIENT_SECRET);
// console.log('REDIRECT_URI:', REDIRECT_URI);
