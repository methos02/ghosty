export const USERNAME_AVAILABILITY = {
  CHECKING: 'checking',
  AVAILABLE: 'available',
  TAKEN: 'taken',
}

export const ACCOUNT_TABS = {
  PROFILE: 'account-profile',
  SECURITY: 'account-security',
  STATISTICS: 'account-statistics',
}

export const ACCOUNT_MENU = [
  { tab: ACCOUNT_TABS.PROFILE, icon: 'fa-regular fa-user' },
  { tab: ACCOUNT_TABS.SECURITY, icon: 'fa-solid fa-lock' },
  { tab: ACCOUNT_TABS.STATISTICS, icon: 'fa-solid fa-chart-simple' },
]
