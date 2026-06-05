import { apiGet } from './http'

export const adminService = {
  getDashboardStats: () => apiGet('/admin/stats'),
}
