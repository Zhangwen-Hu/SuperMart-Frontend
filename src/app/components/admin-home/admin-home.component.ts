import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Order, OrderStatus } from '../../models/order.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  orders: Order[] = [];
  popularProducts: Product[] = [];
  profitableProduct: Product | null = null;
  totalSoldItems = 0;
  displayedColumns: string[] = ['id', 'username', 'totalAmount', 'status', 'createdAt', 'actions'];
  isLoading = true;
  loadingPopularProducts = true;
  loadingProfitableProduct = true;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadPopularProducts();
    this.loadProfitableProduct();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        // Store all orders for calculations
        const allOrders = data || [];
        // Display only the 5 most recent orders on the dashboard
        if (allOrders.length > 0) {
          this.orders = allOrders.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          }).slice(0, 5);
        } else {
          this.orders = [];
        }
        this.calculateTotalSoldItems(allOrders);
        this.isLoading = false;
      },
      error: (err) => {
        this.orders = [];
        this.totalSoldItems = 0;
        this.snackBar.open('Failed to load orders: ' + (err.message || 'Unknown error'), 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  loadPopularProducts(): void {
    this.loadingPopularProducts = true;
    this.productService.getPopularProducts(3).subscribe({
      next: (data) => {
        this.popularProducts = data || [];
        this.loadingPopularProducts = false;
      },
      error: (err) => {
        this.popularProducts = [];
        this.snackBar.open('Failed to load popular products: ' + (err.message || 'Unknown error'), 'Close', {
          duration: 3000
        });
        this.loadingPopularProducts = false;
      }
    });
  }

  loadProfitableProduct(): void {
    this.loadingProfitableProduct = true;
    this.productService.getProfitableProducts(1).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.profitableProduct = data[0];
        } else {
          this.profitableProduct = null;
        }
        this.loadingProfitableProduct = false;
      },
      error: (err) => {
        this.profitableProduct = null;
        this.snackBar.open('Failed to load profitable product: ' + (err.message || 'Unknown error'), 'Close', {
          duration: 3000
        });
        this.loadingProfitableProduct = false;
      }
    });
  }

  calculateTotalSoldItems(orders: Order[]): void {
    this.totalSoldItems = orders
      .filter(order => order.status === OrderStatus.COMPLETED)
      .reduce((total, order) => {
        return total + (order.items?.reduce((itemsTotal: number, item) => itemsTotal + item.quantity, 0) || 0);
      }, 0);
  }

  cancelOrder(id: number): void {
    this.orderService.cancelOrder(id).subscribe({
      next: (updatedOrder) => {
        this.snackBar.open('Order cancelled successfully', 'Close', {
          duration: 3000
        });
        // Reload all orders to refresh the data
        this.loadOrders();
      },
      error: (err) => {
        this.snackBar.open('Failed to cancel order: ' + err.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  completeOrder(id: number): void {
    this.orderService.completeOrder(id).subscribe({
      next: (updatedOrder) => {
        this.snackBar.open('Order completed successfully', 'Close', {
          duration: 3000
        });
        // Reload all orders to refresh the data
        this.loadOrders();
        // Also reload stats that depend on order status
        this.calculateTotalSoldItems(this.orders);
      },
      error: (err) => {
        this.snackBar.open('Failed to complete order: ' + err.message, 'Close', {
          duration: 3000
        });
      }
    });
  }
} 