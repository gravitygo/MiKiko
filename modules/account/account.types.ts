export type AccountType = 'cash' | 'bank' | 'credit_card' | 'e_wallet';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountRow {
  id: string;
  name: string;
  type: string;
  balance: number;
  icon: string;
  color: string;
  is_default: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  icon: string;
  color: string;
  balance?: number;
}

export interface UpdateAccountInput {
  name?: string;
  type?: AccountType;
  icon?: string;
  color?: string;
}

