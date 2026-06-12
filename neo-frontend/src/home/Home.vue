<script setup lang="ts">
import { ref, onMounted } from 'vue';

const apiStatus = ref('waiting'); // waiting, loading, success, error
const apiResponse = ref<any>(null);
const errorMessage = ref('');
const isHoveredIntro = ref(false);
const isHoveredPrivacy = ref(false);

const testApiConnection = async () => {
  apiStatus.value = 'loading';
  apiResponse.value = null;
  errorMessage.value = '';

  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      apiResponse.value = data;
      apiStatus.value = 'success';
    } else {
      apiStatus.value = 'error';
      errorMessage.value = `錯誤代碼: ${res.status}`;
    }
  } catch (err: any) {
    apiStatus.value = 'error';
    errorMessage.value = err.message || '連線失敗，請檢查 API 是否已啟動';
  }
};

onMounted(() => {
  testApiConnection();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-tr from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 py-12 px-6">
    <div class="max-w-4xl mx-auto flex flex-col justify-between min-h-[80vh]">
      
      <!-- Hero Header -->
      <header class="text-center mb-12">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-500/30 mx-auto mb-6">
          N
        </div>
        <span class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/5 border border-blue-500/20 uppercase inline-block mb-4">
          全新系統入口
        </span>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-4">
          歡迎來到 <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Neo Web Portal</span>
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          這是一個基於 Vue 3 獨立模組開發、純前端部署與 ASP.NET Core 10.0 Web API 驅動的現代化應用。
        </p>
      </header>

      <!-- Modules Nav -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        
        <!-- Introduction Module Link -->
        <a 
          href="/introduction/"
          class="relative p-8 rounded-3xl border transition-all duration-300 bg-white/70 dark:bg-slate-800/40 backdrop-blur-md cursor-pointer block"
          :class="isHoveredIntro ? 'border-blue-500/50 shadow-xl shadow-blue-500/5 -translate-y-1' : 'border-white/20 dark:border-slate-800 shadow-md'"
          @mouseenter="isHoveredIntro = true"
          @mouseleave="isHoveredIntro = false"
        >
          <div class="text-4xl mb-4 transform transition-transform duration-300" :class="{ 'scale-110': isHoveredIntro }">🚀</div>
          <h3 class="text-xl font-bold mb-2">Introduction 介紹模組</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            查看關於此專案的詳細功能介紹、Tailwind 4 樣式範本以及獨立 Vue 離島的測試元件。
          </p>
          <div class="mt-6 flex items-center text-sm font-semibold text-blue-500">
            進入模組 <span class="ml-1 transition-transform" :class="{ 'translate-x-1': isHoveredIntro }">→</span>
          </div>
        </a>

        <!-- Privacy Module Link -->
        <a 
          href="/privacy/"
          class="relative p-8 rounded-3xl border transition-all duration-300 bg-white/70 dark:bg-slate-800/40 backdrop-blur-md cursor-pointer block"
          :class="isHoveredPrivacy ? 'border-indigo-500/50 shadow-xl shadow-indigo-500/5 -translate-y-1' : 'border-white/20 dark:border-slate-800 shadow-md'"
          @mouseenter="isHoveredPrivacy = true"
          @mouseleave="isHoveredPrivacy = false"
        >
          <div class="text-4xl mb-4 transform transition-transform duration-300" :class="{ 'scale-110': isHoveredPrivacy }">🛡️</div>
          <h3 class="text-xl font-bold mb-2">Privacy 隱私條款</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            閱讀我們的隱私政策與資料保護聲明，了解我們如何確保您的資料安全與合規。
          </p>
          <div class="mt-6 flex items-center text-sm font-semibold text-indigo-500">
            進入模組 <span class="ml-1 transition-transform" :class="{ 'translate-x-1': isHoveredPrivacy }">→</span>
          </div>
        </a>

      </section>

      <!-- API Connect Test Card -->
      <section class="bg-white/70 dark:bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-slate-800 shadow-lg mb-8">
        <h3 class="text-lg font-bold mb-2 flex items-center">
          <span 
            class="w-2.5 h-2.5 rounded-full mr-2.5"
            :class="apiStatus === 'success' ? 'bg-emerald-500 animate-pulse' : apiStatus === 'loading' ? 'bg-amber-500 animate-spin' : apiStatus === 'error' ? 'bg-rose-500' : 'bg-slate-400'"
          ></span>
          後端 .NET 10.0 API 代理連線驗證
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
          點擊下方按鈕，透過 SWA CLI 發送 HTTP 請求至後端 API `/api/health`，驗證反向代理連線。
        </p>
        
        <div class="flex items-center gap-4 mb-4 flex-wrap">
          <button 
            @click="testApiConnection"
            :disabled="apiStatus === 'loading'"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-2xl font-semibold text-sm transition-all shadow-md hover:shadow-lg focus:outline-none"
          >
            {{ apiStatus === 'loading' ? '連線中...' : '測試連線' }}
          </button>
          
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">
            <template v-if="apiStatus === 'waiting'">等待連線測試...</template>
            <template v-else-if="apiStatus === 'loading'">發送 HTTP GET 請求...</template>
            <template v-else-if="apiStatus === 'success'">連線成功！</template>
            <template v-else-if="apiStatus === 'error'">{{ errorMessage }}</template>
          </span>
        </div>

        <!-- JSON Response display -->
        <transition name="fade">
          <pre 
            v-if="apiResponse" 
            class="text-xs p-5 bg-slate-900 text-slate-100 rounded-2xl max-h-56 overflow-y-auto font-mono border border-slate-800 shadow-inner"
          >{{ JSON.stringify(apiResponse, null, 2) }}</pre>
        </transition>
      </section>

      <!-- Footer -->
      <footer class="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 Neo Web. 模組化前端入口建置完成。</p>
        <div class="flex gap-4">
          <a href="/introduction/" class="hover:text-blue-500">專案文件</a>
          <a href="/privacy/" class="hover:text-blue-500">隱私條款</a>
        </div>
      </footer>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
