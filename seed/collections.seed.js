// collection records — 2-3 collections per brand, looked up by slug
const Brand      = require('../models/Brand')
const Collection = require('../models/Collection')

module.exports = async () => {
    // Look up brands by slug so we're not hardcoding ObjectIds
    const [rolex, patek, ap, iwc] = await Promise.all([
        Brand.findOne({ slug: 'rolex' }),
        Brand.findOne({ slug: 'patek-philippe' }),
        Brand.findOne({ slug: 'audemars-piguet' }),
        Brand.findOne({ slug: 'iwc-schaffhausen' }),
    ])

    const collections = [
        // Rolex
        {
            name:        'Submariner',
            slug:        'rolex-submariner',
            description: 'The definitive dive watch. A benchmark of aquatic performance and timeless style since 1953.',
            coverImage:  '/images/collections/rolex-submariner.jpg',
        },
        {
            name:        'Datejust',
            slug:        'rolex-datejust',
            description: 'The archetype of the classic watch. The first to display the date in a window on the dial.',
            coverImage:  '/images/collections/rolex-datejust.jpg',
        },
        {
            name:        'Daytona',
            slug:        'rolex-daytona',
            description: 'Born to race. The legendary chronograph that conquered Le Mans and the wrists of champions.',
            coverImage:  '/images/collections/rolex-daytona.jpg',
        },
        // Patek Philippe
        {
            name:        'Nautilus',
            slug:        'patek-nautilus',
            description: 'Designed by Gérald Genta in 1976, the Nautilus is the pinnacle of luxury sports watchmaking.',
            coverImage:  '/images/collections/patek-nautilus.jpg',
        },
        {
            name:        'Calatrava',
            slug:        'patek-calatrava',
            description: 'The purest expression of the round dress watch. A masterclass in understated elegance.',
            coverImage:  '/images/collections/patek-calatrava.jpg',
        },
        // Audemars Piguet
        {
            name:        'Royal Oak',
            slug:        'ap-royal-oak',
            description: 'The watch that broke every rule in 1972 and became the world\'s most coveted luxury sports watch.',
            coverImage:  '/images/collections/ap-royal-oak.jpg',
        },
        {
            name:        'Royal Oak Offshore',
            slug:        'ap-royal-oak-offshore',
            description: 'Bigger, bolder, more extreme. The Royal Oak Offshore pushes every boundary of the original.',
            coverImage:  '/images/collections/ap-royal-oak-offshore.jpg',
        },
        // IWC
        {
            name:        'Pilot\'s Watches',
            slug:        'iwc-pilots',
            description: 'Forged for the cockpit. Every IWC pilot\'s watch delivers outstanding legibility and reliability at altitude.',
            coverImage:  '/images/collections/iwc-pilots.jpg',
        },
        {
            name:        'Portugieser',
            slug:        'iwc-portugieser',
            description: 'Originally built for Portuguese navigators, the Portugieser is IWC\'s most elegant dress watch collection.',
            coverImage:  '/images/collections/iwc-portugieser.jpg',
        },
    ]

    const created = await Collection.insertMany(collections)
    console.log(`✅ Collections seeded: ${created.length}`)
    return created
}
