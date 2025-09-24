export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
