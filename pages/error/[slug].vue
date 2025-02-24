<template>
  <div>
    <component :is="errorComponent" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string

const errorComponent = defineAsyncComponent(() =>
  import(`@/components/auth/${slug}.vue`)
)

definePageMeta({
  layout: "landing",
});

</script>