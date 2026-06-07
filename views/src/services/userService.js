/**
 * User service.
 * Profile management and picture upload.
 */
import { apiGet, apiPut, apiUpload } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'
import mockUser from '@/data/user.json'

const mock = {
  getProfile: () => Promise.resolve(mockUser),
  updateProfile: (data) => Promise.resolve({ ...mockUser, ...data }),
  uploadProfilePicture: (_formData) =>
    Promise.resolve({ profilePicture: 'https://placehold.co/200x200' }),
}

const real = {
  getProfile: () => apiGet('/users/profile'),
  updateProfile: (data) => apiPut('/users/profile', data),
  // formData is a FormData instance built by the caller with the file attached.
  uploadProfilePicture: (formData) => apiUpload('/users/profile/picture', formData),
}

export const userService = USE_MOCK ? mock : real
