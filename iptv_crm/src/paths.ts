export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
  },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    affiliates: '/dashboard/affiliates',
    requests: '/dashboard/requests',
    orders: '/dashboard/orders',
    products: '/dashboard/products',
    subscriptions: '/dashboard/subscriptions', // Ajouté pour être complet
    tickets: '/dashboard/tickets', // NOUVELLE LIGNE AJOUTÉE
    settings: '/dashboard/settings',
  },
  errors: {
    notFound: '/errors/not-found',
  },
} as const;