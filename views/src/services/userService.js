/**
 * User service.
 * Profile management and picture upload.
 */
import { apiGet, apiPut, apiUpload } from '@/services/http'

export const userService = {
  getProfile: () => apiGet('/users/profile'),
  updateProfile: (data) => apiPut('/users/profile', data),
  uploadProfilePicture: (formData) => apiUpload('/users/profile/picture', formData),
}
