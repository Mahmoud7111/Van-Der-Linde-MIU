const Brand = require('../models/Brand')

module.exports = async () => {
const brands = [
  {
    name: "Rolex",
    logo: "https://via.placeholder.com/150?text=Rolex",
    description: "Swiss luxury watchmaker renowned for precision, durability, and iconic designs. Founded in 1905, Rolex is synonymous with excellence and prestige.",
    slug: "rolex",
  },
  {
    name: "Omega",
    logo: "https://via.placeholder.com/150?text=Omega",
    description: "Swiss watchmaker famous for precision timekeeping and innovation. Official timekeeper of the Olympic Games and known for the Seamaster and Speedmaster collections.",
    slug: "omega",
  },
  {
    name: "Cartier",
    logo: "https://via.placeholder.com/150?text=Cartier",
    description: "French luxury brand celebrated for exquisite jewelry and watches. Known for timeless elegance and the iconic Tank and Ballon Bleu collections.",
    slug: "cartier",
  },
  {
    name: "Patek Philippe",
    logo: "https://via.placeholder.com/150?text=Patek+Philippe",
    description: "Swiss manufacturer of luxury watches, considered one of the most prestigious watchmakers in the world. Known for exceptional craftsmanship and heritage.",
    slug: "patek-philippe",
  },
  {
    name: "Audemars Piguet",
    logo: "https://via.placeholder.com/150?text=Audemars+Piguet",
    description: "Swiss luxury watchmaker founded in 1875, famous for the Royal Oak collection. Renowned for innovative design and mechanical excellence.",
    slug: "audemars-piguet",
  },
  {
    name: "A.Lange & Söhne",
    logo: "https://via.placeholder.com/150?text=A.Lange+Söhne",
    description: "German luxury watchmaker known for precision engineering and sophisticated design. Specializes in mechanical watches with exceptional complications.",
    slug: "a-lange-sohne",
  },
  {
    name: "Vacheron Constantin",
    logo: "https://via.placeholder.com/150?text=Vacheron+Constantin",
    description: "Swiss luxury watchmaker with a heritage dating back to 1755. Known for timeless elegance, technical mastery, and exclusive timepieces.",
    slug: "vacheron-constantin",
  },
  {
    name: "Jacob & Co",
    logo: "https://via.placeholder.com/150?text=Jacob+Co",
    description: "American luxury jewelry and watch brand known for bold, innovative designs and exceptional craftsmanship. Famous for unique complications and artistic vision.",
    slug: "jacob-co",
  },
  {
    name: "Richard Mille",
    logo: "https://via.placeholder.com/150?text=Richard+Mille",
    description: "French luxury watchmaker renowned for cutting-edge technology and avant-garde design. Creates some of the most expensive and innovative watches in the world.",
    slug: "richard-mille",
  },
  {
    name: "Breitling",
    logo: "https://via.placeholder.com/150?text=Breitling",
    description: "Swiss watchmaker specializing in precision chronographs and aviation watches. Known for reliability, performance, and professional-grade timepieces.",
    slug: "breitling",
  },
];
    const created = await Brand.insertMany(brands)
    console.log(`✅ Brands seeded: ${created.length}`)
    return created
}
