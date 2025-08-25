import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { paths } from '@/paths';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
      }}
    >
      <Stack spacing={4} sx={{p: 3, width: '100%', maxWidth: '450px'}}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            <img src="/logo.png" alt="Logo" style={{ height: '40px', width: 'auto' }} />
          </Box>
        </Box>
        {children}
      </Stack>
    </Box>
  );
}