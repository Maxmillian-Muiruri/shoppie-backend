export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}
