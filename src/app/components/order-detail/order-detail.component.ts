import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Order, OrderItem, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
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
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;
  isAdmin = false;
  displayedColumns: string[] = ['productId', 'productName', 'quantity', 'price', 'subtotal', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private tokenService: TokenStorageService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.tokenService.isAdmin();
    this.loadOrder();
  }

  loadOrder(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.orderService.getOrderById(+id).subscribe({
        next: (data) => {
          this.order = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.snackBar.open('Failed to load order: ' + err.message, 'Close', {
            duration: 3000
          });
          this.isLoading = false;
          this.router.navigate([this.isAdmin ? '/admin-orders' : '/user-home']);
        }
      });
    }
  }

  cancelOrder(): void {
    if (this.order && this.order.id && this.order.status === OrderStatus.PROCESSING) {
      this.orderService.cancelOrder(this.order.id).subscribe({
        next: (data) => {
          this.order = data;
          this.snackBar.open('Order cancelled successfully', 'Close', {
            duration: 3000
          });
        },
        error: (err) => {
          this.snackBar.open('Failed to cancel order: ' + err.message, 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  completeOrder(): void {
    if (this.order && this.order.id && this.order.status === OrderStatus.PROCESSING) {
      this.orderService.completeOrder(this.order.id).subscribe({
        next: (data) => {
          this.order = data;
          this.snackBar.open('Order marked as completed', 'Close', {
            duration: 3000
          });
        },
        error: (err) => {
          this.snackBar.open('Failed to complete order: ' + err.message, 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  getSubtotal(item: OrderItem): number {
    return item.quantity * (item.price || 0);
  }
} 