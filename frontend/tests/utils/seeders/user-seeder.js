import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'

const getUserApi = (overrides = {}) => ({
  id: 42,
  pseudo: 'GhostWriter',
  email: 'ghost@ghosty.test',
  roles: ['user'],
  avatar: null,
  firstname: 'Jean',
  lastname: 'Dupont',
  birth_date: '1990-01-01',
  notifications_enabled: true,
  warning_count: 0,
  new_messages_count: 2,
  banned_until: null,
  email_verified_at: '2025-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

const getUser = (overrides = {}) => ({ ...AuthDto.fromUser(getUserApi()), ...overrides })

const getRegisterForm = (overrides = {}) => ({
  pseudo: 'GhostWriter',
  email: 'ghost@ghosty.test',
  password: 'Secret123!',
  passwordConfirmation: 'Secret123!',
  ...overrides,
})

const getLoginForm = (overrides = {}) => ({
  email: 'ghost@ghosty.test',
  password: 'Secret123!',
  ...overrides,
})

export const userSeeder = {
  getUserApi,
  getUser,
  getRegisterForm,
  getLoginForm,
}
