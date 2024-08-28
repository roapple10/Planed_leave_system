import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid code' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Received tokens:', tokens);
    res.redirect(`/leave-request?token=${tokens.refresh_token}`);
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.redirect('/leave-request?error=auth_failed');
  }
}
