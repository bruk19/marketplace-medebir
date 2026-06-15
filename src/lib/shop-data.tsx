export type Category =
  | "Boutique/Fashion"
  | "Pharmacy"
  | "Auto Spare Shop"
  | "Construction Material Shop"
  | "Cosmetics"
  | "Mobile/PC Shop"
  | "Electronics Shop"
  | "Furniture";

export const ALL_CATEGORIES: Category[] = [
  "Boutique/Fashion",
  "Pharmacy",
  "Auto Spare Shop",
  "Construction Material Shop",
  "Cosmetics",
  "Mobile/PC Shop",
  "Electronics Shop",
  "Furniture",
];

export interface Product {
  id: string;
  shopId: string;
  name: string;
  category: Category;
  itemCost?: number;
  price: number;
  quantity: number;
  barcode?: string;
  size?: string;
  color?: string;
  lowStockAlert?: number;
  image?: string;
  notifyEndDate?: string;
  type?: string;
  brand?: string;
  model?: string;
  specifications?: string;
  warranty?: string;
  unit?: string;
  expireDate?: string;
  manufacturer?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  roomType?: string;
  unitType?: string;
  materialType?: string;
  vehicleCompatibility?: string;
  condition?: string;
  sellableQuantity?: number;
}

export interface Shop {
  id: string;
  name: string;
  location: string;
  phone: string;
  cover?: string;
  logo?: string;
  categories: Category[];
}

const u = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/* Deterministic pseudo-random so server & client render identical dummy data */
function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const COVER_IMAGES = [
  "1567401893414-76b7b1e5a7a5",
  "1587854692152-cbe660dbde88",
  "1518770660439-4636190af475",
  "1486262715619-67b85e0b08d3",
  "1581094288338-2314dddb7ece",
  "1522335789203-aabd1fc54bc9",
  "1512054502232-10a0a035d672",
  "1555041469-a586c61ea9bc",
  "1498049794561-7780e7231661",
];

const LOGO_IMAGES = [
  "1483985988355-763728e1935b",
  "1631549916768-4119b2e5f926",
  "1593642632559-0c6d3fc62b89",
  "1492144534655-ae79c964c9d7",
  "1503387762-592deb58ef4e",
  "1596462502278-27bfdc403348",
  "1511707171634-5f897ff02aa9",
  "1540574163026-643ea20ade25",
  "1550009158-9ebf69173e03",
];

const PRODUCT_IMAGES = [
  "1539008835657-9e8e9680c956",
  "1584917865442-de89df76afd3",
  "1586495777744-4413f21062fa",
  "1543163521-1bf539c55dd2",
  "1550572017-edd951b55104",
  "1584308666744-24d5c474f2ae",
  "1517336714731-489689fd1ca8",
  "1561154464-82e9adf32764",
  "1635764979988-d2c5e0a8d9c6",
  "1504917595217-d4dc5ebe6122",
  "1615873968403-89e068629265",
  "1620916566398-39f1143ab7be",
  "1631214540242-3cd8c4d0ad44",
  "1601925260368-ae2f83cf8b7f",
  "1592286927505-1def25115558",
  "1610945265064-0e34e5519bbf",
  "1590658268037-6bf12165a8df",
  "1581539250439-c96689b516dd",
  "1527443224154-c4a3942d3acf",
  "1587829741301-dc798b83add3",
  "1527814050087-3793815479db",
  "1492144534655-ae79c964c9d7",
];

const LOCATIONS = [
  "Bole", "Piassa", "Megenagna", "Mexico", "Lebu", "Kazanchis", "Sarbet",
  "Gerji", "CMC", "Bole Arabsa", "Summit", "Ayat", "Gotera", "Lideta",
  "Kirkos", "Yeka", "Arada", "Kolfe Keranio", "Saris", "Goro",
];

/* Each category needs at least as many names as the shops it will get.
   Categories 0 & 1 (Boutique, Furniture) get 7 shops, the rest get 6. */
const SHOP_NAMES: Record<Category, string[]> = {
  "Boutique/Fashion": [
    "Addis Threads Boutique", "Style Avenue", "Urban Closet", "Velvet Trends",
    "Chic Corner", "Trendy Wear", "Habesha Couture",
  ],
  Pharmacy: [
    "MediCare Pharmacy", "HealthFirst Pharmacy", "City Pharmacy",
    "Wellness Pharmacy", "Family Care Pharmacy", "Lifeline Pharmacy",
  ],
  "Auto Spare Shop": [
    "AutoParts Plus", "Speedy Auto Spares", "Reliable Auto Parts",
    "Prime Auto Center", "Drive Spares", "AutoFix Parts",
  ],
  "Construction Material Shop": [
    "BuildMart Materials", "Solid Build Supplies", "ConstructPro",
    "Foundation Materials", "MegaBuild Center", "StoneWorks Materials",
  ],
  Cosmetics: [
    "Glow Cosmetics", "Beauty Bar", "Pure Skin Cosmetics", "Radiance Beauty",
    "Luxe Cosmetics", "Bella Beauty Shop",
  ],
  "Mobile/PC Shop": [
    "MobileWorld", "TechZone Mobiles", "Smart Devices Shop", "GadgetHub",
    "NextGen Mobiles", "Digital World",
  ],
  "Electronics Shop": [
    "TechHub Electronics", "Prime Electronics", "Electro Mart",
    "CircuitWorld", "PowerTech Electronics", "Gadget Galaxy",
  ],
  Furniture: [
    "Modern Living Furniture", "Comfort Home", "Oak & Pine", "Urban Furnish",
    "Cozy Living", "Elite Furniture", "Home Craft",
  ],
};

/* ============================================================
   SHOPS — 50 total, ids "shop1".."shop50" → used directly in the URL
   ============================================================ */

export const SHOPS: Shop[] = Array.from({ length: 50 }, (_, i) => {
  const category = ALL_CATEGORIES[i % ALL_CATEGORIES.length];
  const rank = Math.floor(i / ALL_CATEGORIES.length);
  const name = SHOP_NAMES[category][rank % SHOP_NAMES[category].length];
  const location = LOCATIONS[i % LOCATIONS.length];

  const phoneSeed = 910000000 + i * 8231;
  const phone = `+251 ${String(phoneSeed).slice(0, 3)} ${String(phoneSeed).slice(3, 6)} ${String(phoneSeed).slice(6, 9)}`;

  return {
    id: `shop${i + 1}`,
    name,
    location: `${location}, Addis Ababa`,
    phone,
    cover: u(COVER_IMAGES[i % COVER_IMAGES.length]),
    logo: u(LOGO_IMAGES[i % LOGO_IMAGES.length], 200, 200),
    categories: [category],
  };
});

/* ============================================================
   PRODUCT GENERATION
   ============================================================ */

const PRODUCT_NAMES: Record<Category, string[]> = {
  "Boutique/Fashion": [
    "Silk Evening Dress", "Leather Handbag", "Designer Heels", "Silk Scarf",
    "Denim Jacket", "Cotton T-Shirt", "Wool Coat", "Linen Trousers",
    "Summer Dress", "Knit Sweater", "Formal Blazer", "Canvas Sneakers",
    "Wide-Brim Sun Hat", "Leather Belt", "Maxi Skirt", "Cropped Top",
    "Cargo Pants", "Trench Coat", "Ankle Boots", "Pleated Skirt",
    "Denim Shorts", "Wrap Dress", "Bomber Jacket", "Tote Bag",
    "Sunglasses", "Wool Scarf", "Graphic Hoodie", "Linen Shirt",
    "Jumpsuit", "Ballet Flats",
  ],
  Pharmacy: [
    "Paracetamol 500mg", "Vitamin C Tablets", "Digital Thermometer",
    "Amoxicillin 250mg", "Cough Syrup", "Blood Pressure Monitor",
    "First Aid Kit", "Hand Sanitizer", "Multivitamin Capsules",
    "Antiseptic Cream",
  ],
  "Auto Spare Shop": [
    "Brake Pads Set", "Engine Oil 5W-30", "Car Battery 12V", "Air Filter",
    "Spark Plug Set", "Shock Absorber", "Headlight Bulb", "Wiper Blades",
    "Timing Belt", "Radiator Coolant",
  ],
  "Construction Material Shop": [
    "Portland Cement", "Steel Rebar 12mm", "Ceramic Tiles", "PVC Pipe",
    "Plywood Sheet", "Roofing Sheet", "Paint Bucket", "Sand (per ton)",
    "Gravel (per ton)", "Door Hinges Set",
  ],
  Cosmetics: [
    "Hydrating Serum", "Matte Foundation", "Velvet Lipstick",
    "Eyeshadow Palette", "Facial Cleanser", "Sunscreen SPF50",
    "Hair Conditioner", "Nail Polish Set", "Perfume Spray", "Body Lotion",
  ],
  "Mobile/PC Shop": [
    "iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Pro 14", "iPad Air",
    "Wireless Earbuds", "Power Bank", "Phone Case", "Bluetooth Speaker",
    "Smart Watch", "USB-C Charger",
  ],
  "Electronics Shop": [
    "Gaming Monitor 27\"", "Mechanical Keyboard", "Wireless Mouse",
    "LED TV 43\"", "Home Theater System", "Router / Modem",
    "External Hard Drive", "Webcam HD", "Surge Protector", "Desk Lamp LED",
  ],
  Furniture: [
    "Oak Dining Table", "Velvet Lounge Sofa", "Queen Bed Frame", "Bookshelf",
    "Coffee Table", "Office Desk", "Recliner Chair", "Wardrobe",
    "TV Stand", "Bar Stool",
  ],
};

const PRODUCT_TYPES: Record<Category, string[]> = {
  "Boutique/Fashion": ["Dress", "Handbag", "Footwear", "Accessory", "Outerwear", "Top", "Bottom"],
  Pharmacy: ["Pain reliever", "Supplement", "Medical device", "Antibiotic", "Skincare"],
  "Auto Spare Shop": ["Brake system", "Lubricant", "Battery", "Filter", "Suspension"],
  "Construction Material Shop": ["Binder", "Reinforcement", "Finishing", "Insulation", "Plumbing"],
  Cosmetics: ["Skincare", "Makeup", "Lipstick", "Fragrance", "Haircare"],
  "Mobile/PC Shop": ["Smartphone", "Laptop", "Tablet", "Earbuds", "Accessory"],
  "Electronics Shop": ["Monitor", "Keyboard", "Mouse", "Speaker", "Router"],
  Furniture: ["Table", "Sofa", "Bed", "Shelf", "Desk", "Chair"],
};

const BRANDS: Record<Category, string[]> = {
  "Boutique/Fashion": ["Zara", "Gucci", "Coach", "H&M", "Nike", "Levi's", "Mango", "Forever 21"],
  Pharmacy: ["GSK", "Pfizer", "Nature's Bounty", "Omron", "Bayer"],
  "Auto Spare Shop": ["Bosch", "Mobil", "Castrol", "NGK", "Denso"],
  "Construction Material Shop": ["Dangote", "Derba", "Habesha Cement", "National Steel"],
  Cosmetics: ["MAC", "The Ordinary", "Maybelline", "Nivea", "L'Oreal"],
  "Mobile/PC Shop": ["Apple", "Samsung", "Huawei", "Xiaomi", "JBL"],
  "Electronics Shop": ["LG", "Logitech", "Sony", "HP", "Dell"],
  Furniture: ["Ikea", "West Elm", "Ashley", "HomeCraft", "Wayfair"],
};

const PRICE_RANGES: Record<Category, [number, number]> = {
  "Boutique/Fashion": [300, 6000],
  Pharmacy: [50, 1500],
  "Auto Spare Shop": [500, 8000],
  "Construction Material Shop": [200, 2000],
  Cosmetics: [200, 2500],
  "Mobile/PC Shop": [2000, 200000],
  "Electronics Shop": [1000, 35000],
  Furniture: [5000, 45000],
};

const COLORS = ["Black", "White", "Red", "Blue", "Green", "Beige", "Brown", "Gray", "Pink", "Gold", "Silver"];
const SIZES = ["XS", "S", "M", "L", "XL", "38", "39", "40", "41", "42"];

const make = (
  id: string,
  shopId: string,
  name: string,
  category: Category,
  price: number,
  qty: number,
  image: string,
  extras: Partial<Product> = {},
): Product => ({
  id,
  shopId,
  name,
  category,
  price,
  quantity: qty,
  sellableQuantity: qty,
  image: u(image, 600, 600),
  ...extras,
});

function genProducts(shop: Shop, count: number): Product[] {
  const category = shop.categories[0];
  const names = PRODUCT_NAMES[category];
  const types = PRODUCT_TYPES[category];
  const brands = BRANDS[category];
  const [minP, maxP] = PRICE_RANGES[category];
  const shopNum = parseInt(shop.id.replace("shop", ""), 10);

  return Array.from({ length: count }, (_, idx) => {
    const seedBase = shopNum * 1000 + idx;
    const rnd = (n: number) => seeded(seedBase * 7 + n * 3);

    const baseName = names[idx % names.length];
    const variant = Math.floor(idx / names.length);
    const name = variant > 0 ? `${baseName} – Edition ${variant + 1}` : baseName;

    const price = Math.round((minP + rnd(1) * (maxP - minP)) / 5) * 5;
    const itemCost = Math.round(price * (0.55 + rnd(2) * 0.2));
    const quantity = 3 + Math.floor(rnd(3) * 40);
    const image = PRODUCT_IMAGES[seedBase % PRODUCT_IMAGES.length];

    const extras: Partial<Product> = {
      itemCost,
      brand: brands[idx % brands.length],
      type: types[idx % types.length],
    };

    if (idx % 9 === 0) extras.lowStockAlert = 3;

    switch (category) {
      case "Boutique/Fashion":
        extras.color = COLORS[idx % COLORS.length];
        extras.size = SIZES[idx % SIZES.length];
        break;
      case "Pharmacy":
        extras.unit = idx % 2 === 0 ? "Box" : "Bottle";
        extras.expireDate = `${2026 + (idx % 4)}-${String(1 + (idx % 12)).padStart(2, "0")}-15`;
        extras.manufacturer = brands[(idx + 1) % brands.length];
        break;
      case "Construction Material Shop":
        extras.unitType = ["Bag", "Piece", "Box", "Roll"][idx % 4];
        extras.materialType = ["Cement", "Steel", "Ceramic", "Wood", "PVC"][idx % 5];
        extras.specifications = `${(idx % 4) + 1} unit pack`;
        break;
      case "Auto Spare Shop":
        extras.vehicleCompatibility = ["Toyota Corolla 2015-2022", "Universal — petrol & diesel", "Most sedans & SUVs", "Hyundai/Kia 2016+"][idx % 4];
        extras.condition = idx % 6 === 0 ? "Used" : "New";
        extras.warranty = idx % 3 === 0 ? "6 months" : "1 year";
        break;
      case "Cosmetics":
        extras.color = COLORS[idx % COLORS.length];
        extras.expireDate = `${2026 + (idx % 4)}-${String(1 + (idx % 12)).padStart(2, "0")}-28`;
        break;
      case "Mobile/PC Shop":
        extras.model = `Model-${(idx % 9) + 1}`;
        extras.color = COLORS[idx % COLORS.length];
        extras.warranty = idx % 2 === 0 ? "1 year" : "2 years";
        extras.specifications = `${(idx % 4 + 1) * 64}GB storage`;
        break;
      case "Electronics Shop":
        extras.model = `Model-${(idx % 9) + 1}`;
        extras.warranty = idx % 2 === 0 ? "1 year" : "2 years";
        break;
      case "Furniture":
        extras.material = ["Solid Oak Wood", "Velvet Upholstery & Wood Frame", "Engineered Wood", "Steel & Glass", "Rattan"][idx % 5];
        extras.dimensions = `${100 + idx * 5}x${80 + idx * 2}x${70 + idx}cm`;
        extras.weight = `${20 + idx * 3} kg`;
        extras.roomType = ["Living Room", "Bedroom", "Dining Room", "Office"][idx % 4];
        break;
    }

    return make(`${shop.id}-p${idx + 1}`, shop.id, name, category, price, quantity, image, extras);
  });
}

/* shop1 (Boutique/Fashion) gets 50 products to demo pagination, others get 8-14 */
export const PRODUCTS: Product[] = SHOPS.flatMap((shop, i) => {
  const count = shop.id === "shop1" ? 50 : 8 + (i % 7);
  return genProducts(shop, count);
});

export const shopItemCount = (shopId: string) =>
  PRODUCTS.filter((p) => p.shopId === shopId).length;

export const productsForShop = (shopId: string) =>
  PRODUCTS.filter((p) => p.shopId === shopId);
