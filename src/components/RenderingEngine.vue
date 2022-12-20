<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { getSVGProps } from '../utils';

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
const logoElementsRefs = ref();
const computeAutoLayout = async () => {
  autoLayoutData.value = null;
  await nextTick();

  const { width: imageWidth, height: imageHeight } = logoElementsRefs.value
    .find(({ id }) => id === 'mark')
    .getBoundingClientRect();
  const { width: textWidth, height: textHeight } = logoElementsRefs.value
    .find(({ id }) => id === 'name')
    .getBoundingClientRect();

  if (props.autoLayout === 'markTopTextBottom') {
    const logoWidth = Math.max(imageWidth, textWidth);
    const logoHeight = imageHeight + textHeight;

    const textX = textWidth >= imageWidth ? 0 : (logoWidth - textWidth) / 2;
    const textY = imageHeight;

    const imageY = 0;
    const imageX = imageWidth >= textWidth ? 0 : (logoWidth - imageWidth) / 2;

    autoLayoutData.value = {
      width: logoWidth,
      height: logoHeight,
      mark: {
        x: imageX,
        y: imageY,
      },
      name: {
        x: textX,
        y: textY,
      },
    };
    console.log('xxx', autoLayoutData.value);
  }
  if (props.autoLayout === 'markBottomTextTop') {
  }
  if (props.autoLayout === 'markleftTextRight') {
  }
  if (props.autoLayout === 'markRightTextLeft') {
  }
};

watch(
  () => props.data,
  () => {
    if (!props.autoLayout) {
      return;
    }
    computeAutoLayout();
  },
  { immediate: true, deep: true }
);
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
      ref="logoElementsRefs"
      :key="element.id"
      :id="element.id"
      :viewBox="getSVGProps(element.svgData)?.viewBox"
      :width="element.width"
      :height="element.width * getSVGProps(element.svgData)?.aspectRatio"
      :x="autoLayoutData?.[element.id].x || 0"
      :y="autoLayoutData?.[element.id].y || 0"
      v-html="getSVGProps(element.svgData)?.innerHTML"
    ></svg>
  </svg>
</template>

<style scoped lang="scss"></style>
