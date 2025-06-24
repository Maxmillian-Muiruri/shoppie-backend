import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  @Input() product: Product | null = null;
  @Output() submitProduct = new EventEmitter<any>();

  productForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  ngOnChanges() {
    if (this.product) {
      this.productForm.patchValue(this.product);
      this.imagePreview = this.product.imageUrl || null;
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.invalid) return;
    const formValue = { ...this.productForm.value };
    if (this.imageFile) {
      formValue.imageFile = this.imageFile;
    }
    this.submitProduct.emit(formValue);
  }
} 