export interface IProduct {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductResponse {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}
