'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useUser } from '@/hooks/use-user';

interface Props {
  children: React.ReactNode;
}

export function AuthGuard({ children }: Props): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  React.useEffect(() => {
    // Cet effet s'exécute lorsque le chargement est terminé ou que l'utilisateur change.
    // Si le chargement est terminé et qu'il n'y a pas d'utilisateur, alors on redirige.
    if (!isLoading && !user) {
      if (pathname !== '/auth/sign-in') {
        router.replace(`/auth/sign-in?next=${encodeURIComponent(pathname || '/dashboard')}`);
      }
    }
  }, [isLoading, user, router, pathname]);

  // Pendant le chargement ou s'il n'y a pas d'utilisateur (en attente de redirection), on affiche un spinner.
  if (isLoading || !user) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si nous avons un utilisateur, on affiche la page protégée.
  return <>{children}</>;
}
