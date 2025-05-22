import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { OrderItem } from '../../models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: OrderItem[] = [];
  displayedColumns: string[] = ['productName', 'price', 'quantity', 'subtotal', 'actions'];
  isLoading = false;
  isProcessing = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQuantity(item: OrderItem, event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    if (value > 0 && item.productId !== undefined) {
      this.cartService.updateQuantity(item.productId, value);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.snackBar.open('Item removed from cart', 'Close', {
      duration: 3000
    });
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.snackBar.open('Cart cleared', 'Close', {
      duration: 3000
    });
  }

  getSubtotal(item: OrderItem): number {
    return (item.price || 0) * item.quantity;
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      this.snackBar.open('Your cart is empty', 'Close', {
        duration: 3000
      });
      return;
    }

    this.isProcessing = true;
    const orderRequest = {
      orderItems: this.cartService.getCartItemsForOrder()
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.snackBar.open('Order placed successfully', 'Close', {
          duration: 3000
        });
        this.cartService.clearCart();
        this.isProcessing = false;
        this.router.navigate(['/order', order.id]);
      },
      error: (err) => {
        this.snackBar.open('Failed to place order: ' + err.message, 'Close', {
          duration: 3000
        });
        this.isProcessing = false;
      }
    });
  }
} 