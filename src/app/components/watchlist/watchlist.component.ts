import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { WatchlistService } from '../../services/watchlist.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule
  ],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  watchlistProducts: Product[] = [];
  displayedColumns: string[] = ['name', 'price', 'status', 'actions'];
  isLoading = true;

  constructor(
    private watchlistService: WatchlistService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.isLoading = true;
    this.watchlistService.getWatchlistProducts().subscribe({
      next: (data) => {
        this.watchlistProducts = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load watchlist: ' + err.message, 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  removeFromWatchlist(productId: number): void {
    this.watchlistService.removeFromWatchlist(productId).subscribe({
      next: () => {
        this.snackBar.open('Product removed from watchlist', 'Close', {
          duration: 3000
        });
        this.loadWatchlist();
      },
      error: (err) => {
        this.snackBar.open('Failed to remove product from watchlist: ' + err.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackBar.open(`${product.name} added to cart`, 'Close', {
      duration: 3000
    });
  }
} 