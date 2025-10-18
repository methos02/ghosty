
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { authController } from '@brugmann/vuemann/src/services/auth/src/controllers/auth-controller.js'
import { authStore } from '@brugmann/vuemann/src/services/auth/auth-store.js'

const initUserRoles = async (username) => {
    const rolesConfig = ConfigLoader.get('auth.roles')
    if (!rolesConfig) { return true }

    const userGroups = await authController.getUserGroups(username)
    if (!userGroups) { return false }
    
    const userRoles = []
    for (const [roleName, roleRequirements] of Object.entries(rolesConfig)) {
      if (!hasRoleAccess(userGroups, roleRequirements)) { continue }

      userRoles.push(roleName)
    }

    authStore.setCurrentUserRoles(userRoles)
    localStorage.setItem('current_user_roles', JSON.stringify(userRoles))
    
    return true
}

const hasRoleAccess = (userGroups, roleRequirements) => {
  return roleRequirements.every(requirement => {
    const userGroup = userGroups.find(group =>  group.name === requirement.group)
    if (!userGroup) { return false }

    return Number.parseInt(userGroup.level) >= Number.parseInt(requirement.level)
  })
}

const hasUserRole = (roleName) => {
    return authStore.getCurrentUserRoles().includes(roleName)
}

const remove = () => {
    localStorage.removeItem('current_user_roles')
    authStore.setCurrentUserRoles([])
}

export const rolesManager = {
  initUserRoles,
  hasRoleAccess,
  hasUserRole,
  remove
} 
