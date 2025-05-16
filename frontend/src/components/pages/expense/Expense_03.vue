<template>
  <div class="flex flex-col items-center px-6 w-full relative">
    <TopNavBar title="상세 내역" class="mt-16" />

    <!-- 상세 내역 -->
    <div class="w-full px-3 mt-18">
      <!-- 제목 -->
      <div>
        <h4 class="h4">{{ isLoaded && expense.data.category.name }}</h4>
        <h3 class="h3">{{ isLoaded && expense.data.amount.toLocaleString() }}원</h3>
      </div>
      <!-- 구분선 -->
      <div class="w-full px-1 h-13 flex items-center">
        <div class="h-0.5 bg-gray-700 w-full"></div>
      </div>

      <!-- 내용 -->
      <div class="w-full font-semibold px-1 text-cocoa-600">
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="h4">카테고리 설정</h4>
            </div>
            <div class="flex justify-center items-center" @click="toggleIsCategoryOpen">
              <h4 class="h4">{{ isLoaded && expense.data.category.parent }}</h4>
              <BackIcon color="black" class="cursor-pointer inline-block rotate-180" :width="'20'" :height="'24'">
              </BackIcon>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div>
              <h4 class="h4">설명</h4>
            </div>
            <div class="flex justify-center items-center" @click="toggleIsMemoOpen">
              <h4 class="h4">{{ isLoaded && expense.data.description }}</h4>
              <BackIcon color="black" class="cursor-pointer inline-block rotate-180" :width="'20'" :height="'24'">
              </BackIcon>
            </div>
          </div>
          <!-- <div class="flex justify-between items-center">
            <div>
              <h4 class="h4">결제 수단</h4>
            </div>
            <div class="flex justify-center items-center">
              <h4 class="h4">국민카드</h4>
            </div>
          </div> -->
          <div class="flex justify-between items-center">
            <div>
              <h4 class="h4">결제 일시</h4>
            </div>
            <div class="flex justify-center items-center">
              <h4 class="h4">{{ isLoaded && expense.data.date }}</h4>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>

  <!-- 카테고리 변경 모달 -->
  <div v-show="isCategoryOpen"
    class="absolute w-full bottom-0 z-30 shadow-[0px_8px_14px_2px_rgba(0,_0,_0,_0.35)] rounded-t-3xl bg-gray-200">
    <div class="flex w-full items-center px-8 pt-8">
      <div class="flex-1"></div>
      <h3 class="h3 flex text-center">카테고리 설정</h3>
      <div class="flex-1 flex justify-end">
        <XIcon @click="toggleIsCategoryOpen" />
      </div>
    </div>
    <div class="grid grid-cols-2 px-8 gap-5.5 pt-5.5 pb-19">
      <div v-for="category in categories" :key="category" class="flex items-center" @click="selectCategory(category)">
        <div class="bg-gray-500 rounded-full w-8 h-8 flex justify-center items-center">
          <svg v-if="selectedCategory === category" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 class="h4 ml-3">{{ category }}</h4>
      </div>
    </div>
  </div>
  <div v-show="isCategoryOpen" @click="toggleIsCategoryOpen"
    class="z-5 absolute top-0 left-0 w-full h-screen bg-gray-300/70">
  </div>

  <!-- 설명 변경 모달 -->
  <div v-show="isMemoOpen"
    class="absolute w-full bottom-0 z-30 shadow-[0px_8px_14px_2px_rgba(0,_0,_0,_0.35)] rounded-t-3xl bg-gray-200 h-90">
    <div class="flex w-full items-center px-8 pt-8">
      <div class="flex-1"></div>
      <h3 class="h3 flex text-center">설명</h3>
      <div class="flex-1 flex justify-end">
        <XIcon @click="toggleIsMemoOpen" />
      </div>
    </div>
    <div class="w-full p-8">
      <form class="" @click.prevent="">
        <div class="mb-10">
          <textarea class="bg-gray-50 border border-gray-600 text-cocoa-600 rounded-t-lg w-full p-2.5 h-30 resize-none"
            rows="5"></textarea>
        </div>
        <button type="submit"
          class="text-cocoa-600 focus:ring-1 rounded-t-lg text-sm w-full text-center py-1.5 bg-cocoa-100 border border-cocoa-200 h3">확인</button>
      </form>
    </div>
  </div>
  <div v-show="isMemoOpen" @click="toggleIsMemoOpen" class="z-5 absolute top-0 left-0 w-full h-screen bg-gray-300/70">
  </div>
</template>

<script setup lang='ts'>
import TopNavBar from '@/components/navbar/TopNavBar.vue'
import BackIcon from '@/components/common/icons/BackIcon.vue'
import XIcon from '@/components/common/icons/XIcon.vue'
import expenseService from '@/services/api/expenseService'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const expenseId = Number(route.params.id)

const expense = ref<any>(null)
const isLoaded = ref(false)


onMounted(async () => {
  try {
    const response = await expenseService.getExpenseDetail(expenseId)
    expense.value = response
  } finally {
    isLoaded.value = true
  }
})

const menus = [
  { name: '분석', to: 'analysis' },
  { name: '현황', to: 'status' },
]

const categories = [
  "음식·유흥", "주거·통신", "생활·쇼핑", "뷰티·미용", "취미·여가", "교통·차량", "기타"
]

const selectedCategory = ref(null)

const selectCategory = category => {
  if (selectedCategory.value === category) {
    selectedCategory.value = null
    return
  }
  selectedCategory.value = category
}

const isCategoryOpen = ref(false)
const isMemoOpen = ref(false)

const toggleIsCategoryOpen = () => {
  isCategoryOpen.value = !isCategoryOpen.value
}
const toggleIsMemoOpen = () => {
  isMemoOpen.value = !isMemoOpen.value
}

</script>

<style scoped></style>