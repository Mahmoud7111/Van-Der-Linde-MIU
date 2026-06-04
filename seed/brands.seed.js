// brand records — 4 luxury watch brands
const Brand = require('../models/Brand')

module.exports = async () => {
    const brands = [
        {
            name:        'Rolex',
            slug:        'rolex',
            logo:        '/images/brands/rolex.png',
            description: 'The undisputed king of luxury timepieces. Founded in 1905, Rolex has defined precision and prestige for over a century.',
        },
        {
            name:        'Patek Philippe',
            slug:        'patek-philippe',
            logo:        '/images/brands/patek-philippe.png',
            description: 'You never actually own a Patek Philippe. You merely look after it for the next generation. Geneva\'s finest since 1839.',
        },
        {
            name:        'Audemars Piguet',
            slug:        'audemars-piguet',
            logo:        '/images/brands/audemars-piguet.png',
            description: 'Makers of the iconic Royal Oak, the world\'s first luxury sports watch in stainless steel. Boldness since 1875.',
        },
        {
            name:        'IWC Schaffhausen',
            slug:        'iwc-schaffhausen',
            logo:        '/images/brands/iwc.png',
            description: 'Engineering excellence from the Swiss town of Schaffhausen. Pilots, divers, and dress watches of exceptional precision since 1868.',
        },
    ]

    const created = await Brand.insertMany(brands)
    console.log(`✅ Brands seeded: ${created.length}`)
    return created
}
