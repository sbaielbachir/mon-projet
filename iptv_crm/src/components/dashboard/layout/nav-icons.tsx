import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Package as PackageIcon } from '@phosphor-icons/react/dist/ssr/Package';
import { Repeat as RepeatIcon } from '@phosphor-icons/react/dist/ssr/Repeat';
import { ShoppingCart as ShoppingCartIcon } from '@phosphor-icons/react/dist/ssr/ShoppingCart';
import { Headset as HeadsetIcon } from '@phosphor-icons/react/dist/ssr/Headset';
import { Handshake as HandshakeIcon } from '@phosphor-icons/react/dist/ssr/Handshake';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  users: UsersIcon,
  'package': PackageIcon,
  repeat: RepeatIcon,
  'shopping-cart': ShoppingCartIcon,
  headset: HeadsetIcon,
  handshake: HandshakeIcon,
  user: UserIcon,
} as Record<string, Icon>;