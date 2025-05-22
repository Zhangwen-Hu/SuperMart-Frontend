import { Order } from './order.model';
import { Product } from './product.model';

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  enabled?: boolean;
  roles?: Role[];
  orders?: Order[];
  watchlist?: Product[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Role {
  id?: number;
  name: ERole;
}

export enum ERole {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export interface JwtResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
} 