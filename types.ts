
export type Category = 'Momos' | 'Burgers' | 'Fries' | 'Pizzas' | 'Drinks';

export type TierType = 'Bronze' | 'Silver' | 'Gold';

export type DeliverySpeed = 'Standard' | 'Express';

export interface LoyaltyTier {
  name: TierType;
  minPoints: number;
  benefits: string[];
  color: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  image: string;
  variants?: string[];
  reviews?: Review[];
  featured?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedVariant?: string;
  deliverySpeed?: DeliverySpeed;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Preparing' | 'Out for Delivery' | 'Delivered';
  timestamp: number;
  pointsEarned: number;
}

export interface UserProfile {
  name: string;
  points: number;
  history: Order[];
}
