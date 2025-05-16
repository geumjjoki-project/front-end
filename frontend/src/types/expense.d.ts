export interface Category {
  id: number;
  name: string;
  parent: string;
}

export interface Expense {
  expense_id: number;
  date: string;       // "YYYY-MM-DD"
  amount: number;
  category: Category;
  description: string;
}

export interface Pagination {
  current_page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ExpenseListData {
  expenses: Expense[];
  total_amount: number;
  total_count: number;
  pagination: Pagination;
}

export interface ExpenseListResponse {
  status: string;           // "success" 등
  data: ExpenseListData;
}