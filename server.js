import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import googleOAuthRouter from './src/routes/googleCalendar.route.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:3000'],
}));

app.use('/api/google', googleOAuthRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));