import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderRequest } from '../models/order.model';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8080/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
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

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_URL}/all`, this.getHttpOptions());
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${API_URL}/${id}`, this.getHttpOptions());
  }

  createOrder(orderRequest: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${API_URL}`, { order: orderRequest.orderItems }, this.getHttpOptions());
  }

  cancelOrder(id: number): Observable<Order> {
    return this.http.patch<Order>(`${API_URL}/${id}/cancel`, {}, this.getHttpOptions());
  }

  completeOrder(id: number): Observable<Order> {
    return this.http.patch<Order>(`${API_URL}/${id}/complete`, {}, this.getHttpOptions());
  }
} 