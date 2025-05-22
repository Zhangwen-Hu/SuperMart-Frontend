import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { OrderItem } from '../models/order.model';

const CART_KEY = 'shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: OrderItem[] = [];
  private cartItemsSubject = new BehaviorSubject<OrderItem[]>([]);

  constructor() {
    // Load cart from local storage on service initialization
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  private saveCart(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cartItems));
    this.cartItemsSubject.next(this.cartItems);
  }

  getCartItems(): Observable<OrderItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId: product.id!,
        productName: product.name,
        quantity: quantity,
        price: product.retailPrice
      });
    }
    
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.saveCart();
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  }

  getCartItemsForOrder(): OrderItem[] {
    return this.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
  }
} 