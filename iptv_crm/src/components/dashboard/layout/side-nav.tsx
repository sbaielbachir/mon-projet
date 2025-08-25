'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';

// Import des icônes
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Handshake as HandshakeIcon } from '@phosphor-icons/react/dist/ssr/Handshake';
import { EnvelopeSimple as EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/ssr/EnvelopeSimple';
import { ListChecks as ListChecksIcon } from '@phosphor-icons/react/dist/ssr/ListChecks';
import { Package as PackageIcon } from '@phosphor-icons/react/dist/ssr/Package';
import { Headset as HeadsetIcon } from '@phosphor-icons/react/dist/ssr/Headset'; // NOUVELLE ICÔNE IMPORTÉE

const navItems: NavItemConfig[] = [
    { key: 'overview', title: 'Tableau de bord', href: paths.dashboard.overview, icon: ChartPieIcon },
    { key: 'customers', title: 'Clients', href: paths.dashboard.customers, icon: UsersIcon },
    { key: 'products', title: 'Produits', href: paths.dashboard.products, icon: PackageIcon },
    { key: 'orders', title: 'Commandes', href: paths.dashboard.orders, icon: ListChecksIcon },
    { key: 'affiliates', title: 'Affiliés', href: paths.dashboard.affiliates, icon: HandshakeIcon },
    { key: 'requests', title: 'Demandes d\'affiliation', href: paths.dashboard.requests, icon: EnvelopeSimpleIcon },
    // --- DÉBUT DE LA MODIFICATION ---
    { key: 'tickets', title: 'Support Tickets', href: paths.dashboard.tickets, icon: HeadsetIcon },
    // --- FIN DE LA MODIFICATION ---
    { key: 'account', title: 'Mon Compte', href: paths.dashboard.account, icon: UserIcon },
];

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--mui-zIndex-appBar)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'inline-flex' }}>
          <img src="/logo.png" alt="IptvFasty Logo" style={{ height: '40px', width: 'auto' }} />
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'var(--mui-palette-neutral-900)',
            border: '1px solid var(--mui-palette-neutral-700)',
            borderRadius: '12px',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography color="var(--mui-palette-neutral-400)" variant="body2">
              Workspace
            </Typography>
            <Typography color="inherit" variant="subtitle1">
              IPTV Fasty CRM
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;
    acc.push(<NavItem key={key} pathname={pathname} {...item} />);
    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({ disabled, external, href, icon: Icon, matcher, pathname, title }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const linkProps = href
    ? external
      ? { component: 'a', href, target: '_blank', rel: 'noreferrer' }
      : { component: RouterLink, href }
    : {};

  return (
    <li>
      <Box
        {...linkProps}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          gap: 1,
          p: '6px 16px',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
          '&:hover': { ...(!active && { bgcolor: 'var(--NavItem-hover-background)' }) },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {Icon ? <Icon fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'} fontSize="var(--icon-fontSize-md)" weight={active ? 'fill' : undefined} /> : null}
        </Box>
        <Typography component="span" sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
    </li>
  );
}