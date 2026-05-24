<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  title?: string;
}>();

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const updateTitle = () => {
  if (props.title) {
    document.title = `${props.title} - neo_backend`;
  }
};

onMounted(() => {
  updateTitle();
});

watch(() => props.title, () => {
  updateTitle();
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
    <!-- Navbar Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Desktop Navigation -->
          <div class="flex items-center space-x-10">
            <a href="/" class="flex items-center space-x-2 group">
              <span class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                N
              </span>
              <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-700 bg-clip-text text-transparent group-hover:opacity-95 transition-opacity duration-300">
                neo-web
              </span>
            </a>
            
            <nav class="hidden md:flex space-x-6">
              <a href="/" class="text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:-translate-y-0.5 transition-all duration-200">
                首頁 (Home)
              </a>
              <a href="/Home/Privacy" class="text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:-translate-y-0.5 transition-all duration-200">
                隱私政策 (Privacy)
              </a>
            </nav>
          </div>

          <!-- Right Side Actions (Desktop) -->
          <div class="hidden md:flex items-center space-x-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              .NET 10 & Vue 3 Island
            </span>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button 
              @click="toggleMobileMenu" 
              type="button" 
              class="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-controls="mobile-menu"
              :aria-expanded="isMobileMenuOpen"
            >
              <span class="sr-only">切換選單</span>
              <svg 
                class="h-6 w-6 transform transition-transform duration-300" 
                :class="{ 'rotate-90': isMobileMenuOpen }"
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  v-if="!isMobileMenuOpen" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
                <path 
                  v-else 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="isMobileMenuOpen" class="md:hidden bg-white border-b border-slate-200" id="mobile-menu">
          <div class="px-2 pt-2 pb-4 space-y-1">
            <a href="/" class="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
              首頁 (Home)
            </a>
            <a href="/Home/Privacy" class="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
              隱私政策 (Privacy)
            </a>
            <div class="border-t border-slate-100 mt-2 pt-2 px-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                .NET 10 & Vue 3 Active
              </span>
            </div>
          </div>
        </div>
      </transition>
    </header>

    <!-- Main Content Slot -->
    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full transition-all duration-300">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-8 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-slate-500 text-sm">
          <div class="flex items-center space-x-2">
            <span class="font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">neo-web Solution</span>
            <span class="text-slate-300">|</span>
            <span>&copy; 2025 - All Rights Reserved.</span>
          </div>
          <div class="flex space-x-6">
            <a href="/Home/Privacy" class="hover:text-indigo-600 hover:underline transition-all duration-200">
              隱私政策 (Privacy)
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
