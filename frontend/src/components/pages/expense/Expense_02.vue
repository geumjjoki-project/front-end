<template>
  <div class="flex flex-col items-center px-6 w-full bg-gray-200">
    <TopNavBar title="소비" class="mt-16" />
    <NavBar :menus="menus" />
    <!-- 총 지출 금액 -->
    <div class="w-full rounded-3xl bg-gold-200 text-cocoa-600 mb-7">
      <p class="font-bold pl-4 pt-2">총 지출 금액</p>
      <div v-if="isLoaded">
        <h1 class="h1 text-center fw-black mb-7.5">{{ expenseStore.totalAmount.toLocaleString() }}원</h1>
      </div>
      <div v-else>
        <h1 class="h1 text-center fw-black mb-7.5">
          로딩 중...
        </h1>
      </div>
    </div>

    <!-- 조회 조건 -->
    <div class="relative z-10 w-full">
      <div
        class="relative w-full rounded-xl bg-gold-200 text-cocoa-600 flex justify-between items-center pl-4 pr-6 z-50"
        :class="isFilterOpen ? 'bg-gold-300' : ''" @click="toggleFilter">
        <h3 class="text-xl font-bold">조회 조건</h3>
        <DownArrow />
      </div>

      <!-- 조회 조건 모달 -->
      <div v-show="isFilterOpen"
        class="absolute top-0 left-0 w-full z-30 shadow-[0px_8px_14px_2px_rgba(0,_0,_0,_0.35)] rounded-xl">
        <div class="w-full pt-12 rounded-xl bg-white text-cocoa-600 p-4.5">
          <div class="mt-5">
            <h3 class="text-xl font-bold mb-2">카테고리별</h3>
            <div class="grid grid-cols-4 gap-1">
              <button v-for="category in categories" :key="category" class="rounded-lg bg-gold-300 w-22 h-12 h4"
                :class="selectedCategories.includes(category) ? 'bg-gold-500' : ''" @click="toggleCategory(category)">
                {{ category }}
              </button>
            </div>
          </div>
          <div class="mt-8 mb-4.5">
            <h3 class="text-xl font-bold mb-2">이용 기간</h3>
            <div class="grid grid-cols-4 gap-1">
              <button v-for="period in periods" :key="period" class="rounded-lg bg-gold-300 w-22 h-12 h4"
                :class="selectedPeriod === period ? 'bg-gold-500' : ''" @click="selectPeriod(period)">
                {{ period }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isFilterOpen" @click="toggleFilter" class="z-5 absolute top-0 left-0 w-full h-screen bg-gray-300/70">
    </div>

    <!-- 구분선 -->
    <div class="w-full px-6 h-13 flex items-center">
      <div class="h-0.5 bg-gray-700 w-full"></div>
    </div>

    <!-- 조회 결과 -->
    <div class="w-full font-semibold">
      <div class="flex justify-between mb-9 px-6 font-black">
        <p>총 {{ expenseStore.totalCount }}건</p>
        <p>{{ expenseStore.totalAmount.toLocaleString() }}원</p>
      </div>
      <div class="flex flex-col space-y-7">
        <div v-for="expense in expenseStore.expenses" :key="expense.expense_id" class="flex justify-between px-6 items-center"
          @click="goToDetail(expense.expense_id)">
          <div>
            <p>{{ expense.category?.name || '미분류' }}</p>
            <p>{{ expense.description }}</p>
          </div>
          <div class="font-black">
            <p>{{ expense.amount.toLocaleString() }}원</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="expenseStore.hasNext" class="flex items-center space-x-4 cursor-pointer mb-24"
      @click="expandList">
      <span class="text-gray-700 font-black">더보기
      </span>
      <DownIcon />
    </div>
    <div v-else class="mb-44"></div>
  </div>
</template>

<script setup lang='ts'>
import TopNavBar from '@/components/navbar/TopNavBar.vue'
import NavBar from '@/components/navbar/NavBar.vue'
import DownArrow from '@/components/common/icons/DownArrow.vue'
import DownIcon from '@/components/common/icons/DownIcon.vue'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useExpenseStore } from '@/stores/expenseStore'

const expenseStore = useExpenseStore()

const isLoaded = ref(false)

onMounted(async () => {
  await expenseStore.fetchExpenses()
  isLoaded.value = true
})


const menus = [
  { name: '분석', to: 'analysis' },
  { name: '현황', to: 'status' },
]



const categories = [
  "음식·유흥", "주거·통신", "생활·쇼핑", "뷰티·미용", "취미·여가", "교통·차량", "기타"
]

const periods = [
  "전체", "일주일", "한달",
]

const selectedCategories = ref([])

const selectedPeriod = ref(null)

const toggleCategory = category => {
  const idx = selectedCategories.value.indexOf(category)
  if (idx >= 0) selectedCategories.value.splice(idx, 1)
  else selectedCategories.value.push(category)
}

const selectPeriod = period => {
  selectedPeriod.value = period
}

const isFilterOpen = ref(false)

const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value
}

const route = useRoute()
const router = useRouter()

const goToDetail = (expenseId: number) => {
  router.push(`/expense/status/${expenseId}`)
}

const visibleCount = ref(5)

const expenseList = computed(() => expenseStore.expenses || [])
const visibleExpenses = computed(() => expenseList.value.slice(0, visibleCount.value))

const expandList = async () => {
  if (expenseStore.hasNext && !expenseStore.isLoading) {
    await expenseStore.fetchExpenses(expenseStore.currentPage + 1, 5)
  }
}
</script>

<style scoped></style>