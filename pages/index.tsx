import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';

const LandingPage = () => {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Image src="/logo.png" alt="Admazes Logo" width={100} height={100} />
        <Typography variant="h4" component="h1" sx={{ mt: 4, mb: 4 }}>
          員工休假系統
        </Typography>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push('/leave-request')}
          >
            請假申請
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => router.push('/leave-settings')}
          >
            休假設定
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage;
