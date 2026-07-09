export const LEFT_NAV_ITEMS = [
  { label: 'Archive', href: '/archive', disabled: false },
  { label: 'DeepDive', href: '/deep-dive', disabled: false },
  { label: 'Book', href: '/book', disabled: false },
] as const;

export const RIGHT_NAV_ITEMS = [
  { label: 'AI Update', href: '/ai-updates', disabled: false },
  { label: 'AI Education', href: '#', disabled: true },
  { label: 'About', href: '/about', disabled: false },
] as const;

export const MOBILE_NAV_ITEMS = [...LEFT_NAV_ITEMS, ...RIGHT_NAV_ITEMS] as const;

export type HomeNavItem = (typeof MOBILE_NAV_ITEMS)[number];
