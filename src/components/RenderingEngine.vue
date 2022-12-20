<script setup>
import { getSVGProps } from '@/utils';

const props = defineProps({
  data: {
    type: Array,
    reuired: true,
  },
  autoLayout: {
    type: String,
    default: null,
  },
});

// AUTO LAYOUTING:
// autolayout compose logo by predefined logo layouts
const autoLayoutData = ref(null);
const computeAutoLayout = (layout) => {
  if (layout === 'markTopTextBottom') {
  }
  if (layout === 'markBottomTextTop') {
  }
  if (layout === 'markleftTextRight') {
  }
  if (layout === 'markRightTextLeft') {
  }
};
</script>

<template>
  <svg
    class="main-svg"
    xmlns="http://www.w3.org/2000/svg"
    :width="autoLayoutData?.width || null"
    :height="autoLayoutData?.height || null"
    :viewBox="
      autoLayoutData
        ? `0 0 ${autoLayoutData.width} ${autoLayoutData.height}`
        : null
    "
  >
    <svg
      v-for="element in data"
      :key="element.id"
      :id="element.id"
      :viewBox="getSVGProps(element.content).viewBox"
      :width="element.width"
      :height="element.height"
      :x="autoLayoutData?.elements[element.id].x || 0"
      :y="autoLayoutData?.elements[element.id].y || 0"
      v-html="getSVGProps(element.content).innerHTML"
    ></svg>
  </svg>
</template>

<style scoped lang="scss"></style>
