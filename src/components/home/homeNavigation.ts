export const MOBILE_NAV_ITEMS = [
  { label: 'Knowledge', href: '/knowledge', disabled: false },
] as const;

export type HomeNavItem = (typeof MOBILE_NAV_ITEMS)[number];
