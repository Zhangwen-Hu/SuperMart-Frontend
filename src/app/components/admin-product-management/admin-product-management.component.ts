import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-admin-product-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-product-management.component.html',
  styleUrls: ['./admin-product-management.component.scss']
})
export class AdminProductManagementComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'name', 'retailPrice', 'wholesalePrice', 'quantity', 'actions'];
  isLoading = true;
  productForm!: FormGroup;
  isEditing = false;
  editingProductId: number | null = null;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();

    // Check if we're in edit mode from route parameters
    this.route.queryParams.subscribe(params => {
      if (params['edit'] && params['id']) {
        this.editProduct(+params['id']);
      }
    });
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      retailPrice: [0, [Validators.required, Validators.min(0.01)]],
      wholesalePrice: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
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

  editProduct(id: number): void {
    this.isEditing = true;
    this.editingProductId = id;
    
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          retailPrice: product.retailPrice,
          wholesalePrice: product.wholesalePrice,
          quantity: product.quantity
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to load product details: ' + err.message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  resetForm(): void {
    this.productForm.reset();
    this.isEditing = false;
    this.editingProductId = null;
    this.initForm();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData: Product = {
      ...this.productForm.value
    };

    if (this.isEditing && this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, productData).subscribe({
        next: () => {
          this.snackBar.open('Product updated successfully', 'Close', {
            duration: 3000
          });
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open('Failed to update product: ' + err.message, 'Close', {
            duration: 3000
          });
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.snackBar.open('Product created successfully', 'Close', {
            duration: 3000
          });
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open('Failed to create product: ' + err.message, 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
} 