const Watch = require('../models/Watch')

module.exports = async (brands, collections) => {
    const getBrand = (name) => brands.find((b) => b.name === name)?._id
    const getCollection = (name) => collections.find((c) => c.name === name)?._id

    const watches = [
        {
            name: "Van Der Linde Sovereign Tourbillon",
            slug: "van-der-linde-sovereign-tourbillon",
            brand: getBrand("Rolex"),
            collection: getCollection("Heritage"),
            gender: "men",
            price: 24990,
            category: "luxury",
            rating: 4.9,
            numReviews: 124,
            stock: 8,
            images: [
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Sovereign+Tourbillon+1",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Sovereign+Tourbillon+2",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Sovereign+Tourbillon+3"
            ],
            description: "A flagship gold-accent mechanical piece with skeleton dial craftsmanship."
        },
        {
            name: "Van Der Linde Imperial Date",
            slug: "van-der-linde-imperial-date",
            brand: getBrand("Omega"),
            collection: getCollection("Heritage"),
            gender: "women",
            price: 9990,
            category: "luxury",
            rating: 4.5,
            numReviews: 64,
            stock: 14,
            images: [
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Imperial+Date+1",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Imperial+Date+2",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Imperial+Date+3"
            ],
            description: "Classic dress aesthetics with date aperture and polished case architecture."
        },
        {
            name: "Van Der Linde Nocturne Chronograph",
            slug: "van-der-linde-nocturne-chronograph",
            brand: getBrand("Cartier"),
            collection: getCollection("Noir Series"),
            gender: "men",
            price: 18990,
            category: "luxury",
            rating: 4.8,
            numReviews: 93,
            stock: 11,
            images: [
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Nocturne+Chronograph+1",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Nocturne+Chronograph+2",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Nocturne+Chronograph+3"
            ],
            description: "A deep black chronograph with brass details and precision movement."
        },
        {
            name: "Van Der Linde Diver Noir",
            slug: "van-der-linde-diver-noir",
            brand: getBrand("Patek Philippe"),
            collection: getCollection("Noir Series"),
            gender: "men",
            price: 18500,
            category: "luxury",
            rating: 4.5,
            numReviews: 61,
            stock: 15,
            images: [
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Diver+Noir+1",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Diver+Noir+2",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Diver+Noir+3"
            ],
            description: "A high-contrast diver with reinforced bezel grip and stealthy matte finishing."
        },
        {
            name: "Van Der Linde Velocity Pro",
            slug: "van-der-linde-velocity-pro",
            brand: getBrand("Audemars Piguet"),
            collection: getCollection("Sport Elite"),
            gender: "men",
            price: 3799,
            category: "sport",
            rating: 4.6,
            numReviews: 157,
            stock: 26,
            images: [
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Velocity+Pro+1",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Velocity+Pro+2",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Velocity+Pro+3"
            ],
            description: "A sport-focused model with shock resistance and water protection."
        },
        {
            name: "Van Der Linde Aqua Terra",
            slug: "van-der-linde-aqua-terra",
            brand: getBrand("A.Lange & Söhne"),
            collection: getCollection("Sport Elite"),
            gender: "men",
            price: 5050,
            category: "sport",
            rating: 4.4,
            numReviews: 150,
            stock: 28,
            images: [
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Aqua+Terra+1",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Aqua+Terra+2",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Aqua+Terra+3"
            ],
            description: "A versatile sport companion with maritime styling and robust daily water resistance."
        },
        {
            name: "Van Der Linde Bleu Classic",
            slug: "van-der-linde-bleu-classic",
            brand: getBrand("Vacheron Constantin"),
            collection: getCollection("Casual & Everyday"),
            gender: "women",
            price: 4350,
            category: "classic",
            rating: 4.6,
            numReviews: 96,
            stock: 18,
            images: [
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Bleu+Classic+1",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Bleu+Classic+2",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Bleu+Classic+3"
            ],
            description: "A polished dress silhouette with gentle curves and a sapphire crown."
        },
        {
            name: "Van Der Linde Golden Ellipse",
            slug: "van-der-linde-golden-ellipse",
            brand: getBrand("Jacob & Co"),
            collection: getCollection("Casual & Everyday"),
            gender: "women",
            price: 6750,
            category: "classic",
            rating: 4.5,
            numReviews: 76,
            stock: 13,
            images: [
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Golden+Ellipse+1",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Golden+Ellipse+2",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Golden+Ellipse+3"
            ],
            description: "A vintage-inspired oval silhouette with restrained elegance."
        },
        {
            name: "Van Der Linde Pulse Connected",
            slug: "van-der-linde-pulse-connected",
            brand: getBrand("Richard Mille"),
            collection: getCollection("Casual & Everyday"),
            gender: "women",
            price: 2299,
            category: "smart",
            rating: 4.4,
            numReviews: 219,
            stock: 42,
            images: [
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Pulse+Connected+1",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Pulse+Connected+2",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Pulse+Connected+3"
            ],
            description: "A smart hybrid watch with health tracking and multi-day battery."
        },
        {
            name: "Van Der Linde Model S",
            slug: "van-der-linde-model-s",
            brand: getBrand("Breitling"),
            collection: getCollection("Casual & Everyday"),
            gender: "men",
            price: 3520,
            category: "smart",
            rating: 4.3,
            numReviews: 175,
            stock: 33,
            images: [
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Model+S+1",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Model+S+2",
                "https://placehold.co/800x800/0d1b2a/c9a84c?text=Model+S+3"
            ],
            description: "A modern smart watch built for daily tracking with a clean, minimal interface."
        }
    ]

    const created = await Watch.insertMany(watches)
    console.log(`✅ Watches seeded: ${created.length}`)
    return created
}
