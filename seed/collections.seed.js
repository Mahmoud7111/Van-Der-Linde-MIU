const Brand = require('../models/Brand')
const Collection = require('../models/Collection')

module.exports = async (brands) => {
    const collections = [
        {
            name: "Heritage",
            description: "Traditional silhouettes rooted in classical horology with modern reliability.",
            coverImage: "@/assets/Models/TonySoprano.jpg",
            slug: "heritage"
        },
        {
            name: "Casual & Everyday",
            description: "Timeless designs that seamlessly integrate into daily life, combining functionality with subtle style.",
            coverImage: "@/assets/Models/Lalo.png",
            slug: "casual-everyday"
        },
        {
            name: "Noir Series",
            description: "Dark-toned luxury watches with refined contrast and understated aggression.",
            coverImage: "@/assets/Models/Henry-Cavill-Longines.jpg",
            slug: "noir-series"
        },
        {
            name: "Sport Elite",
            description: "Performance-first timepieces built for motion, endurance, and bold presence.",
            coverImage: "@/assets/Models/sport1.png",
            slug: "sport-elite"
        }
    ]

    const created = await Collection.insertMany(collections)
    console.log(`✅ Collections seeded: ${created.length}`)
    return created
}
