import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSnackBarModule
  ],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
  orders: Order[] = [];
  frequentProducts: Product[] = [];
  recentProducts: Product[] = [];
  displayedColumns: string[] = ['id', 'totalAmount', 'status', 'createdAt', 'actions'];
  isLoading = true;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadFrequentProducts();
    this.loadRecentProducts();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load orders: ' + err.message, 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  loadFrequentProducts(): void {
    this.productService.getFrequentProducts(3).subscribe({
      next: (data) => {
        this.frequentProducts = data;
      },
      error: (err) => {
        this.snackBar.open('Failed to load frequent products: ' + err.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  loadRecentProducts(): void {
    this.productService.getRecentProducts(3).subscribe({
      next: (data) => {
        this.recentProducts = data;
      },
      error: (err) => {
        this.snackBar.open('Failed to load recent products: ' + err.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  cancelOrder(id: number): void {
    this.orderService.cancelOrder(id).subscribe({
      next: () => {
        this.snackBar.open('Order cancelled successfully', 'Close', {
          duration: 3000
        });
        this.loadOrders();
      },
      error: (err) => {
        this.snackBar.open('Failed to cancel order: ' + err.message, 'Close', {
          duration: 3000
        });
      }
    });
  }
} 