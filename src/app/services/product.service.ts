import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8080/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
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

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/all`, this.getHttpOptions());
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/${id}`, this.getHttpOptions());
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${API_URL}`, product, this.getHttpOptions());
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.patch<Product>(`${API_URL}/${id}`, product, this.getHttpOptions());
  }

  getProfitableProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/profit/${count}`, this.getHttpOptions());
  }

  getPopularProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/popular/${count}`, this.getHttpOptions());
  }

  getRecentProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/recent/${count}`, this.getHttpOptions());
  }

  getFrequentProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/frequent/${count}`, this.getHttpOptions());
  }
} 