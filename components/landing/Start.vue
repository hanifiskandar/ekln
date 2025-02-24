<template>
  <!-- <div>
    <h1>Color mode: {{ $colorMode.value }}</h1>
    <select v-model="$colorMode.preference">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="sepia">Sepia</option>
    </select>
  </div> -->
  <!-- <pre>{{ userProfile }}</pre> -->
  <main class="grid lg:grid-cols-2 place-items-center pt-16 pb-8 md:pt-8">
    <div class="p-24 md:order-1 hidden md:block">
      <img
        class="rounded-full transition-transform transform hover:scale-125"
        src="~/assets/img/internship-bg.png"
        alt="Starship starts the engine"
        loading="eager"
        format="avif"
        width="512"
        height="512"
      />
    </div>
    <div>
      <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight">
        Sertai kami di Kementerian Kerja Raya Malaysia
      </h1>
      <p class="text-lg mt-4 text-slate-600 max-w-xl">
        Kementerian Kerja Raya menyediakan tempat untuk latihan industri kepada pelajar-pelajar 
        di peringkat Diploma dan Sarjana Muda dari Institusi Pengajian Tinggi (IPT) Tempatan dan Swasta.
      </p>
      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <LandingLink
          href="/register"
          rel="noopener"
          >Mohon Sekarang</LandingLink
        >
        <LandingLink
          size="lg"
          styleName="outline"
          rel="noopener"
          href="#"
          >Learn More</LandingLink
        >
      </div>
    </div>
  </main>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const user = useUserStore();
const userProfile = computed(() => user.userProfile);

const colorMode = useColorMode()
colorMode.preference = "light";
</script>

<style>
body {
  background-color: #fff;
  color: rgba(0,0,0,0.8);
}
.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}
.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}
</style>