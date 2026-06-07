// 1 admin user + 1 regular user
// passwords are hashed by the User model's pre-save hook
const User = require('../models/User')

module.exports = async () => {
    const users = [
        {
            name:     'Admin',
            email:    'admin@vanderlinde.com',
            password: 'Admin@123456',
            role:     'admin',
            address: {
                street:  '1 Rue de la Paix',
                city:    'Geneva',
                state:   '',
                zip:     '1201',
                country: 'Switzerland',
            },
        },
        {
            name:     'John Doe',
            email:    'john@example.com',
            password: 'User@123456',
            role:     'user',
            address: {
                street:  '42 Avenue des Champs-Élysées',
                city:    'Paris',
                state:   '',
                zip:     '75008',
                country: 'France',
            },
        },
    ]

    // Use insertMany won't trigger pre-save hooks — we must save individually
    const created = []
    for (const userData of users) {
        const user = new User(userData)
        await user.save()  // triggers bcrypt pre-save hook
        created.push(user)
    }

    console.log(`✅ Users seeded: ${created.length}`)
    console.log(`   Admin → email: admin@vanderlinde.com  pass: Admin@123456`)
    console.log(`   User  → email: john@example.com       pass: User@123456`)
    return created
}
