import { authRoutes } from "@brugmann/vuemann/src/services/auth/auth-routes.js";
import { utilsRoutes } from "@brugmann/vuemann/src/services/utils/utils-routes.js";

const serviceRoutes = []
serviceRoutes.push(...authRoutes, ...utilsRoutes)

export const getServiceRoutes = () => serviceRoutes
