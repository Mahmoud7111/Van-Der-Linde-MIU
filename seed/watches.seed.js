const Watch = require('../models/Watch')

const imagePath = (fileName) => `@/assets/images/Watches/${fileName}`

const nameFromImage = (fileName) => fileName.replace(/\.[^.]+$/, '')

const slugFromName = (name) =>
    name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

module.exports = async (brands, collections) => {
    const getBrand = (name) => brands.find((b) => b.name === name)?._id
    const getCollection = (name) => collections.find((c) => c.name === name)?._id

    const watchSeeds = [
        {
            image: "Rolex Submariner.png",
            brand: "Rolex",
            collection: "Sport Elite",
            gender: "men",
            price: 14990,
            category: "dive",
            rating: 4.9,
            numReviews: 124,
            stock: 8,
            description: "A professional dive watch with classic sport proportions and everyday durability."
        },
        {
            image: "Omega Seamaster Aqua Terra.png",
            brand: "Omega",
            collection: "Sport Elite",
            gender: "men",
            price: 5050,
            category: "sport",
            rating: 4.4,
            numReviews: 150,
            stock: 28,
            description: "A versatile sport companion with maritime styling and robust daily water resistance."
        },
        {
            image: "Patek Philippe Nautilus White Gold.png",
            brand: "Patek Philippe",
            collection: "Heritage",
            gender: "men",
            price: 68990,
            category: "luxury",
            rating: 4.9,
            numReviews: 93,
            stock: 6,
            description: "A white-gold luxury icon with refined bracelet finishing and elegant presence."
        },
        {
            image: "Audemars Piguet Royal Oak.png",
            brand: "Audemars Piguet",
            collection: "Heritage",
            gender: "men",
            price: 37990,
            category: "luxury",
            rating: 4.8,
            numReviews: 157,
            stock: 10,
            description: "A bold integrated-bracelet design known for its sharp case geometry."
        },
        {
            image: "Cartier Tank Must.png",
            brand: "Cartier",
            collection: "Casual & Everyday",
            gender: "unisex",
            price: 4350,
            category: "classic",
            rating: 4.6,
            numReviews: 96,
            stock: 18,
            description: "A clean rectangular dress watch with timeless everyday elegance."
        },
        {
            image: "Breitling Navitimer.png",
            brand: "Breitling",
            collection: "Sport Elite",
            gender: "men",
            price: 8990,
            category: "pilot",
            rating: 4.7,
            numReviews: 76,
            stock: 13,
            description: "A pilot chronograph with technical scale details and strong aviation character."
        },
        {
            image: "Jacob & Co Astronomia Triple Axis Tourbillon.png",
            brand: "Jacob & Co",
            collection: "Noir Series",
            gender: "men",
            price: 249990,
            category: "luxury",
            rating: 4.9,
            numReviews: 41,
            stock: 3,
            description: "A dramatic high-complication showpiece with sculptural tourbillon architecture."
        },
        {
            image: "Richard Mille RM 011 FM White Ghost.png",
            brand: "Richard Mille",
            collection: "Noir Series",
            gender: "men",
            price: 185000,
            category: "luxury",
            rating: 4.8,
            numReviews: 61,
            stock: 5,
            description: "A technical tonneau-case watch with lightweight materials and racing energy."
        },
        {
            image: "Vacheron Constantin Historiques 222.png",
            brand: "Vacheron Constantin",
            collection: "Heritage",
            gender: "men",
            price: 67500,
            category: "classic",
            rating: 4.7,
            numReviews: 52,
            stock: 7,
            description: "A revived vintage-style luxury sports watch with elegant proportions."
        },
        {
            image: "A. Lange & Söhne Zeitwerk Striking Time.png",
            brand: "A.Lange & SÃ¶hne",
            collection: "Noir Series",
            gender: "men",
            price: 119990,
            category: "luxury",
            rating: 4.9,
            numReviews: 37,
            stock: 4,
            description: "A German mechanical statement piece with a distinctive digital time display."
        }
    ]

    const watches = watchSeeds.map((watch) => {
        const name = nameFromImage(watch.image)

        return {
            name,
            slug: slugFromName(name),
            brand: getBrand(watch.brand),
            collection: getCollection(watch.collection),
            gender: watch.gender,
            price: watch.price,
            category: watch.category,
            rating: watch.rating,
            numReviews: watch.numReviews,
            stock: watch.stock,
            images: [imagePath(watch.image)],
            description: watch.description
        }
    })

    const created = await Watch.insertMany(watches)
    console.log(`Watches seeded: ${created.length}`)
    return created
}
