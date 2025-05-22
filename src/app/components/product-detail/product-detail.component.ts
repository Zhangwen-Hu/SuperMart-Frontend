import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WatchlistService } from '../../services/watchlist.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  isAdmin = false;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private watchlistService: WatchlistService,
    private tokenService: TokenStorageService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.tokenService.isAdmin();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      this.router.navigate(['/products']);
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load product: ' + err.message, 'Close', {
          duration: 3000
        });
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;
    
    this.cartService.addToCart(this.product, this.quantity);
    this.snackBar.open(`${this.product.name} added to cart`, 'Close', {
      duration: 3000
    });
  }

  addToWatchlist(): void {
    if (!this.product) return;
    
    this.watchlistService.addToWatchlist(this.product.id!).subscribe({
      next: () => {
        this.snackBar.open(`${this.product?.name || 'Product'} added to watchlist`, 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        if (err.status === 409) {
          this.snackBar.open(`${this.product?.name || 'Product'} is already in your watchlist`, 'Close', {
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

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
} 