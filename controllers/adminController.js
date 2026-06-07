const { getDashboardStats } = require('../services/adminService')

const getDashboardStatsHandler = async (req, res, next) => {
  try {
    const stats = await getDashboardStats()
    res.status(200).json({ success: true, message: 'OK', data: stats })
  } catch (err) {
    next(err)
  }
}

module.exports = { getDashboardStats: getDashboardStatsHandler }
