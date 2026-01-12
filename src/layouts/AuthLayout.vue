<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
    <div class="w-full max-w-md bg-slate-800/60 backdrop-blur rounded-2xl shadow-xl border border-white/10 p-8">
      <router-view />
    </div>
  </div>
</template>

<script>
export default { name: 'AuthLayout' }
</script>
