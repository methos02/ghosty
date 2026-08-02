import { STATUS } from '@/constants/ajax-constants.js'

// Format standard d'une réponse de controller.
// Succès : { status: SUCCESS, ...données } (ex. { status, chapters }, { status, chapter }).
export const controllerSuccess = (data = {}) => ({ status: STATUS.SUCCESS, ...data })

// Erreur : { status, error } — le controller passe cette réponse telle quelle.
export const controllerError = (status = STATUS.ERROR_SERVER, error = 'boom') => ({ status, error })
