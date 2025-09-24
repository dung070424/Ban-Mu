export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}
