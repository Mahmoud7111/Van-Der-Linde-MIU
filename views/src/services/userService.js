/**
 * User service.
 * Profile management, picture upload, and admin user management.
 */
import { apiGet, apiPut, apiDelete, apiUpload } from '@/services/http'

export const userService = {
  getProfile: () => apiGet('/users/profile'),
  updateProfile: (data) => apiPut('/users/profile', data),
  uploadProfilePicture: (formData) => apiUpload('/users/profile/picture', formData),
  // Admin only
  getAll: () => apiGet('/users'),
  deleteById: (id) => apiDelete(`/users/${id}`),
}
