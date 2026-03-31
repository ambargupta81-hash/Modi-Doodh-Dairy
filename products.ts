export type ProductUnit = 'weight' | 'liquid';

export interface Product {
  id: string;
  name: string;
  basePrice: number; // Price per kg or liter
  image: string;
  unitType: ProductUnit;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Fresh Paneer",
    basePrice: 360,
    image: "/images/makhan.jpeg",
    unitType: "weight",
    description: "Soft, malai paneer made daily from pure whole cow milk. Perfect for all your rich curries and snacks."
  },
  {
    id: "p2",
    name: "Pure Ghee",
    basePrice: 750,
    image: "/images/ghee.jpeg",
    unitType: "weight",
    description: "Traditional danedar cow ghee with a rich aroma. Ideal for cooking, sweets, and daily consumption."
  },
  {
    id: "p3",
    name: "Fresh Dahi (Curd)",
    basePrice: 100,
    image: "/images/dahi.jpeg",
    unitType: "weight",
    description: "Thick, creamy, and mildly sour natural curd. Sets perfectly and aids digestion."
  },
  {
    id: "p4",
    name: "Makhan (White Butter)",
    basePrice: 450,
    image: "/images/paneer.jpeg",
    unitType: "weight",
    description: "Unsalted traditional white butter made from fresh cream. Essential for parathas and dal makhani."
  },
  {
    id: "p5",
    name: "Fresh Cream (Malai)",
    basePrice: 400,
    image: "/images/cream.jpeg",
    unitType: "weight",
    description: "Rich and thick dairy cream. Elevates the taste of your gravies, soups, and desserts."
  },
  {
    id: "p6",
    name: "Pure Dudh (Milk)",
    basePrice: 60,
    image: "/images/dudh.jpeg",
    unitType: "liquid",
    description: "Farm fresh, unadulterated whole milk. Delivered fresh every morning."
  },
  {
    id: "p7",
    name: "Matha (Buttermilk)",
    basePrice: 20,
    image: "/images/matha.jpeg",
    unitType: "liquid",
    description: "Refreshing, spiced buttermilk. A perfect natural cooler for your body."
  },
  {
    id: "p8",
    name: "Sweet Lassi",
    basePrice: 120,
    image: "/images/lassi.jpeg",
    unitType: "liquid",
    description: "Thick, creamy, and sweet traditional lassi topped with light malai."
  },
  {
    id: "p9",
    name: "Khoa (Mawa)",
    basePrice: 320,
    image: "/images/khoa.jpeg",
    unitType: "weight",
    description: "Pure milk solids reduced slowly. The essential base for all your favorite Indian sweets."
  },
  {
    id: "p10",
    name: "Fresh Matar (Green Peas)",
    basePrice: 120,
    image: "/images/matar.jpeg",
    unitType: "weight",
    description: "Sweet, tender, and fresh green peas. Perfect companion for our fresh paneer."
  }
];

export const WEIGHT_OPTIONS = [
  { label: "100g", value: 100, unit: "g" },
  { label: "200g", value: 200, unit: "g" },
  { label: "250g", value: 250, unit: "g" },
  { label: "500g", value: 500, unit: "g" },
  { label: "750g", value: 750, unit: "g" },
  { label: "1 kg", value: 1000, unit: "kg" },
  { label: "2 kg", value: 2000, unit: "kg" },
];

export const LIQUID_OPTIONS = [
  { label: "250ml", value: 250, unit: "ml" },
  { label: "500ml", value: 500, unit: "ml" },
  { label: "1 L", value: 1000, unit: "L" },
  { label: "2 L", value: 2000, unit: "L" },
  { label: "5 L", value: 5000, unit: "L" },
];
