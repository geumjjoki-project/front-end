import { defineStore } from 'pinia'
import expenseService from '@/services/api/expenseService'
import type { Expense, ExpenseListResponse } from '@/types/expense'

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    expenses: [] as Expense[],
    totalAmount: 0,
    totalCount: 0,
    pagination: null as ExpenseListResponse['data']['pagination'] | null,
    isLoading: false,
    currentPage: 1,
    hasNext: true,
  }),
  actions: {
    async fetchExpenses(page = 1, pageSize = 5) {
      this.isLoading = true;
      try {
        const res = await expenseService.getExpenses({ page, page_size: pageSize });
        if (page === 1) {
          // 첫 페이지면 새로 할당
          this.expenses = res.data.expenses;
        } else {
          // 2페이지 이상이면 누적 append
          this.expenses = this.expenses.concat(res.data.expenses);
        }
        this.totalAmount = res.data.total_amount;
        this.totalCount = res.data.total_count;
        this.pagination = res.data.pagination;
        this.currentPage = res.data.pagination.current_page;
        this.hasNext = res.data.pagination.has_next;
      } catch (e) {
        console.error('지출 내역 불러오기 실패:', e);
      } finally {
        this.isLoading = false;
      }
    },
  }
});
