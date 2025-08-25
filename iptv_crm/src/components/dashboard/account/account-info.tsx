'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useUser } from '@/hooks/use-user';
import { api } from '@/lib/api';
import { Alert } from '@mui/material';

export function AccountInfo(): React.JSX.Element {
  const { user, checkSession } = useUser();
  const [avatarSrc, setAvatarSrc] = React.useState(user?.avatar);
  const [uploadStatus, setUploadStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => {
    setAvatarSrc(user?.avatar);
  }, [user?.avatar]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarSrc(e.target?.result as string);
      reader.readAsDataURL(file);

      // Envoyer le fichier au backend
      const formData = new FormData();
      formData.append('avatar', file);
      
      try {
        await api.post('/client/avatar/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setUploadStatus({ type: 'success', message: 'Image mise à jour.' });
        await checkSession?.(); // Recharger les données utilisateur
      } catch (error) {
        setUploadStatus({ type: 'error', message: "Échec de l'envoi." });
        setAvatarSrc(user?.avatar); // Revenir à l'ancienne image en cas d'erreur
      }
    }
  };

  const handleUploadClick = () => {
    document.getElementById('avatar-upload-input')?.click();
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={avatarSrc || '/assets/avatar.png'} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user?.firstName} {user?.lastName}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.city || 'Ville non définie'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.is_staff ? 'Administrateur' : 'Client'}
            </Typography>
          </Stack>
          {uploadStatus && <Alert severity={uploadStatus.type} sx={{ mt: 2, width: '100%' }}>{uploadStatus.message}</Alert>}
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" onClick={handleUploadClick}>
          Changer l'image
        </Button>
        <input type="file" id="avatar-upload-input" hidden accept="image/*" onChange={handleFileChange} />
      </CardActions>
    </Card>
  );
}