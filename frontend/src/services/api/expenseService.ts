import apiClient from "@/plugins/axios";
import type { ExpenseListResponse, Expense } from "@/types/expense";

const expenseService = {
  getExpenses: async (params?: { page?: number; page_size?: number;[key: string]: any }): Promise<ExpenseListResponse> => {
    const response = await apiClient.get('/expenses/', { params });
    console.log('getExpenses 호출', response.data)
    return response.data as ExpenseListResponse;
  },
  getExpenseDetail: async (expenseId: number): Promise<Expense> => {
    const response = await apiClient.get(`/expenses/${expenseId}/`);
    console.log('getExpenseDetail 호출', response.data)
    return response.data as Expense;
  },
  getSummary: async () => {
    const response = await apiClient.get('/expenses/summary/');
    console.log('getSummary 호출', response.data)
    return {
      categories: response.data.category_summary,
      totalAmount: response.data.total_amount || 0,
    }
  },
};

export default expenseService;