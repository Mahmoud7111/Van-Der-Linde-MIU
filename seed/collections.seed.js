const Brand = require('../models/Brand')
const Collection = require('../models/Collection')

module.exports = async (brands) => {
    const collections = [
        {
            name: "Heritage",
            description: "Traditional silhouettes rooted in classical horology with modern reliability.",
            coverImage: "https://placehold.co/800x800/0d1b2a/c9a84c?text=Heritage",
            slug: "heritage"
        },
        {
            name: "Casual & Everyday",
            description: "Timeless designs that seamlessly integrate into daily life, combining functionality with subtle style.",
            coverImage: "https://placehold.co/800x800/0d1b2a/c9a84c?text=Casual+%26+Everyday",
            slug: "casual-everyday"
        },
        {
            name: "Noir Series",
            description: "Dark-toned luxury watches with refined contrast and understated aggression.",
            coverImage: "https://placehold.co/800x800/0d1b2a/c9a84c?text=Noir+Series",
            slug: "noir-series"
        },
        {
            name: "Sport Elite",
            description: "Performance-first timepieces built for motion, endurance, and bold presence.",
            coverImage: "https://placehold.co/800x800/0d1b2a/c9a84c?text=Sport+Elite",
            slug: "sport-elite"
        }
    ]

    const created = await Collection.insertMany(collections)
    console.log(`✅ Collections seeded: ${created.length}`)
    return created
}
