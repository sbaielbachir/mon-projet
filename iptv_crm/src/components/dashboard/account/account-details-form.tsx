'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { useUser } from '@/hooks/use-user';
import { api } from '@/lib/api';
import { Alert, CircularProgress, Stack } from '@mui/material';

const schema = zod.object({
  firstName: zod.string().min(1, 'Le prénom est requis.'),
  lastName: zod.string().min(1, 'Le nom est requis.'),
  email: zod.string().email("L'email est invalide.").min(1, "L'email est requis."),
  telephone: zod.string().optional(),
  ville: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;

export function AccountDetailsForm(): React.JSX.Element {
  const { user, checkSession } = useUser();
  const [isPending, setIsPending] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
      ville: '',
    },
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        telephone: user.telephone || '',
        ville: user.city || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: Values) => {
    if (!user) return;
    setIsPending(true);
    setSubmitStatus(null);
    try {
      const payload = {
        user: {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
        },
        telephone: values.telephone,
        ville: values.ville,
      };

      // --- CORRECTION : Utilisation du bon endpoint ---
      // L'API pour modifier son propre profil est /client/me/
      await api.put(`/client/me/`, payload);
      // --- FIN DE LA CORRECTION ---
      
      setSubmitStatus({ type: 'success', message: 'Profil mis à jour avec succès !' });
      await checkSession?.(); // Met à jour les données dans toute l'application
    } catch (error) {
        console.error(error);
      setSubmitStatus({ type: 'error', message: 'La mise à jour a échoué. Veuillez réessayer.' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Les informations peuvent être modifiées" title="Profil" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.firstName}>
                    <InputLabel>Prénom</InputLabel>
                    <OutlinedInput {...field} label="Prénom" />
                    {errors.firstName && <FormHelperText>{errors.firstName.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.lastName}>
                    <InputLabel>Nom</InputLabel>
                    <OutlinedInput {...field} label="Nom" />
                    {errors.lastName && <FormHelperText>{errors.lastName.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.email}>
                    <InputLabel>Adresse e-mail</InputLabel>
                    <OutlinedInput {...field} label="Adresse e-mail" type="email" />
                    {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="telephone"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Numéro de téléphone</InputLabel>
                    <OutlinedInput {...field} label="Numéro de téléphone" type="tel" />
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="ville"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Ville</InputLabel>
                    <OutlinedInput {...field} label="Ville" />
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          {submitStatus && (
            <Stack sx={{ mt: 3 }}>
                <Alert severity={submitStatus.type}>
                {submitStatus.message}
                </Alert>
            </Stack>
          )}
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? <CircularProgress size={24} /> : 'Sauvegarder'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}