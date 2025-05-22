import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../../services/token-storage.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  username?: string;
  cartItemCount = 0;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private tokenStorageService: TokenStorageService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.subscriptions.push(
      this.tokenStorageService.isLoggedIn$.subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
      })
    );
    
    this.subscriptions.push(
      this.tokenStorageService.isAdmin$.subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      })
    );
    
    this.subscriptions.push(
      this.tokenStorageService.username$.subscribe(username => {
        this.username = username;
      })
    );

    // Subscribe to cart changes
    this.subscriptions.push(
      this.cartService.getCartItems().subscribe(items => {
        this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }
} 