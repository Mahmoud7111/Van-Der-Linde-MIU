const User = require('../models/User')

module.exports = async () => {
    // Plain-text passwords are intentional — the User model's pre-save
    // hook hashes them with bcrypt (saltRounds 12) before writing to DB.
    // Pre-hashing here would double-hash and break login.
    const createdUsers = []
    for (const u of [
        { name: 'Admin', email: 'admin@vanderlinde.com', password: 'admin123', role: 'admin' },
        { name: 'User',  email: 'user@vanderlinde.com',  password: 'user123',  role: 'user'  },
    ]) {
        const user = new User(u)
        await user.save()
        createdUsers.push(user)
    }

    console.log(`✅ Users seeded: ${createdUsers.length}`)
    console.log(`   Admin → email: admin@vanderlinde.com  pass: admin123`)
    console.log(`   User  → email: user@vanderlinde.com   pass: user123`)
    return createdUsers
}
