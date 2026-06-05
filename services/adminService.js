const Order = require('../models/Order')
const User  = require('../models/User')
const Watch = require('../models/Watch')

const getDashboardStats = async () => {
  const [revenueResult, ordersByStatus, totalUsers, totalWatches, recentOrders] =
    await Promise.all([
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      User.countDocuments(),
      Watch.countDocuments(),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email'),
    ])

  return {
    totalRevenue:   revenueResult[0]?.total || 0,
    ordersByStatus,
    totalUsers,
    totalWatches,
    recentOrders,
  }
}

module.exports = { getDashboardStats }
