import { User } from './user.model';
import { Product } from './product.model';

export interface Order {
  id?: number;
  userId?: number;
  user?: User;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export interface OrderItem {
  id?: number;
  productId: number;
  product?: Product;
  quantity: number;
  price?: number;
  productName?: string;
  productDescription?: string;
}

export interface OrderRequest {
  orderItems: OrderItem[];
}

export interface OrderResponse extends Order {
  items: OrderItem[];
} 