export interface Product {
  id?: number;
  name: string;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  usersWatching?: any[];
  createdAt?: Date;
  updatedAt?: Date;
} 