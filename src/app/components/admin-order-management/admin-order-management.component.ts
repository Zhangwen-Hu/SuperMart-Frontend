import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-admin-order-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-order-management.component.html',
  styleUrls: ['./admin-order-management.component.scss']
})
export class AdminOrderManagementComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  displayedColumns: string[] = ['id', 'username', 'totalAmount', 'status', 'createdAt', 'actions'];
  isLoading = true;
  searchTerm = '';
  statusFilter = 'all';

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.applyFilters();
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

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = 
        order.id?.toString().includes(this.searchTerm) || 
        order.user?.username?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  cancelOrder(id: number): void {
    this.orderService.cancelOrder(id).subscribe({
      next: (updatedOrder) => {
        this.snackBar.open('Order cancelled successfully', 'Close', {
          duration: 3000
        });
        // Reload all orders to ensure data is fresh
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
        // Reload all orders to ensure data is fresh
        this.loadOrders();
      },
      error: (err) => {
        this.snackBar.open('Failed to complete order: ' + err.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  getStatusCount(status: string): number {
    return this.orders.filter(order => order.status === status).length;
  }
} 