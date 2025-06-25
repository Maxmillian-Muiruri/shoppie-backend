import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent {
  @Input() product: Product | null = null;
  @Output() saved = new EventEmitter<Product>();
  @Output() cancelled = new EventEmitter<void>();

  private productService = inject(ProductService);
  productForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;
  imageUrl: string = '';
  loading = false;
  error = '';
  uploadingImage = false;
  uploadError = '';

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.product) {
      this.productForm.patchValue(this.product);
      this.imagePreview = this.product.image || null;
      this.imageUrl = this.product.image || '';
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.uploadingImage = true;
      this.uploadError = '';
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
      this.productService.uploadImage(file).subscribe({
        next: (res) => {
          this.imageUrl = res.imageUrl;
          this.productForm.patchValue({ image: this.imageUrl });
          this.uploadingImage = false;
        },
        error: (err) => {
          this.uploadingImage = false;
          this.uploadError = err.error?.message || 'Failed to upload image.';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid || this.uploadingImage) return;
    this.loading = true;
    this.error = '';
    const productData = { ...this.productForm.value, image: this.imageUrl };
    if (this.product) {
      // Update
      this.productService.updateProduct(this.product.id, productData).subscribe({
        next: (updated) => {
          this.loading = false;
          this.saved.emit(updated);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to update product.';
        }
      });
    } else {
      // Create
      this.productService.createProduct(productData).subscribe({
        next: (created) => {
          this.loading = false;
          this.saved.emit(created);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to create product.';
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
} 