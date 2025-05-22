import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8080/watchlist';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) { }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.tokenService.getToken()}`
      })
    };
  }

  getWatchlistProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/products/all`, this.getHttpOptions());
  }

  addToWatchlist(productId: number): Observable<any> {
    return this.http.post(`${API_URL}/product/${productId}`, {}, {
      ...this.getHttpOptions(),
      responseType: 'text'
    });    
  }

  removeFromWatchlist(productId: number): Observable<any> {
    return this.http.delete(`${API_URL}/product/${productId}`, {
      ...this.getHttpOptions(),
      responseType: 'text'
    });
    
  }
} 