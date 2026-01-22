
import { MenuItem } from './types';

export const COLORS = {
  primary: '#EAB308', // Gold/Yellow from logo
  secondary: '#1A1A1A', // Dark from logo
  accent: '#DC2626', // Red for spice
};

const dummyReviews = [
  { id: 'r1', userName: 'Anjali S.', rating: 5, comment: 'Best momos in town! So juicy.', timestamp: Date.now() - 86400000 },
  { id: 'r2', userName: 'Rahul K.', rating: 4, comment: 'Really good, but a bit spicy for me.', timestamp: Date.now() - 172800000 },
];

export const MENU_ITEMS: MenuItem[] = [
  // MOMOS
  { 
    id: 'm1', 
    category: 'Momos', 
    name: 'Classical Veggie', 
    price: 60, 
    description: 'Traditional veggie filling steamed to perfection with Himalayan spices.', 
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&q=80&w=600', 
    variants: ['Steamed', 'Fried'],
    reviews: [...dummyReviews]
  },
  { 
    id: 'm2', 
    category: 'Momos', 
    name: 'Paneer Delight', 
    price: 75, 
    description: 'Soft paneer chunks mixed with aromatic herbs and bell peppers.', 
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=600', 
    variants: ['Steamed', 'Fried'],
    reviews: [{ id: 'r3', userName: 'Priya M.', rating: 5, comment: 'The paneer is so fresh!', timestamp: Date.now() - 50000000 }],
    featured: true
  },
  { 
    id: 'm3', 
    category: 'Momos', 
    name: 'Momo Mushroom', 
    price: 85, 
    description: 'Earthy mushrooms sautéed with garden greens and garlic.', 
    image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&q=80&w=600', 
    variants: ['Steamed', 'Fried'],
    reviews: []
  },
  { 
    id: 'm4', 
    category: 'Momos', 
    name: 'Cheese Burst', 
    price: 70, 
    description: 'A blend of three cheeses that melts in your mouth with every bite.', 
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=600', 
    variants: ['Steamed', 'Fried'],
    reviews: [{ id: 'r4', userName: 'Vikram R.', rating: 4, comment: 'Cheesy goodness!', timestamp: Date.now() - 1000000 }]
  },
  { 
    id: 'm5', 
    category: 'Momos', 
    name: 'Choco Bliss', 
    price: 75, 
    description: 'A sweet twist! Dark chocolate filling inside a delicate wrapper.', 
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600', 
    variants: ['Baked'],
    reviews: []
  },
  
  // BURGERS
  { 
    id: 'b1', 
    category: 'Burgers', 
    name: 'Junior Delight', 
    price: 55, 
    description: 'Perfectly sized veggie patty with fresh lettuce and mayo.', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    reviews: []
  },
  { 
    id: 'b2', 
    category: 'Burgers', 
    name: 'Mighty Monsters', 
    price: 79, 
    description: 'Double patty, extra cheese, and our signature Q-Sauce.', 
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=600',
    reviews: [{ id: 'r5', userName: 'Chef J.', rating: 5, comment: 'Huge and delicious.', timestamp: Date.now() }],
    featured: true
  },

  // FRIES
  { 
    id: 'f1', 
    category: 'Fries', 
    name: 'Tiny Treat', 
    price: 45, 
    description: 'Golden, crispy, and lightly salted classic fries.', 
    image: 'https://images.unsplash.com/photo-1630384066252-19e1f57333b9?auto=format&fit=crop&q=80&w=600',
    reviews: []
  },

  // PIZZAS
  { 
    id: 'p1', 
    category: 'Pizzas', 
    name: 'Margherita', 
    price: 99, 
    description: 'Fresh basil, gooey mozzarella, and our hand-crushed tomato sauce.', 
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=600',
    reviews: []
  },
  { 
    id: 'p5', 
    category: 'Pizzas', 
    name: 'Paneer Peri-Peri', 
    price: 239, 
    description: 'Spiced paneer, onions, and bell peppers with peri-peri drizzle.', 
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    reviews: [],
    featured: true
  },

  // DRINKS
  { 
    id: 'd1', 
    category: 'Drinks', 
    name: 'Queen\'s Cold Coffee', 
    price: 75, 
    description: 'Brewed over 12 hours for a smooth, rich, and creamy finish.', 
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
    reviews: [],
    featured: true
  },
];
