
import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Tableau de Bord', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Clients', href: paths.dashboard.customers, icon: 'users' },
  { key: 'products', title: 'Produits', href: paths.dashboard.products, icon: 'package' }, // Changé
  { key: 'subscriptions', title: 'Abonnements', href: paths.dashboard.subscriptions, icon: 'repeat' }, // Changé
  { key: 'orders', title: 'Commandes', href: paths.dashboard.orders, icon: 'shopping-cart' },
  { key: 'tickets', title: 'Support Tickets', href: paths.dashboard.tickets, icon: 'headset' }, // Changé
  { key: 'affiliates', title: 'Affiliés', href: paths.dashboard.affiliates, icon: 'handshake' },
  { key: 'account', title: 'Mon Compte', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];