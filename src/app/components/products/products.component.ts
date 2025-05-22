import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WatchlistService } from '../../services/watchlist.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  searchTerm = '';
  sortOption = 'name';
  sortDirection = 'asc';
  categoryFilter = 'all';
  categories: string[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private watchlistService: WatchlistService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load products: ' + err.message, 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    // First filter by search term
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    // Then sort
    this.filteredProducts.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortOption) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.retailPrice - b.retailPrice;
          break;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackBar.open(`${product.name} added to cart`, 'Close', {
      duration: 3000
    });
  }

  addToWatchlist(product: Product): void {
    this.watchlistService.addToWatchlist(product.id!).subscribe({
      next: () => {
        this.snackBar.open(`${product.name} added to watchlist`, 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        // Check if error is due to item already in watchlist (HTTP 409 Conflict)
        if (err.status === 409) {
          this.snackBar.open(`${product.name} is already in your watchlist`, 'Close', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Failed to add to watchlist: ' + err.message, 'Close', {
            duration: 3000
          });
        }
      }
    });
  }
} 