<script setup>
import { ref, onMounted } from 'vue';
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
const computeAutoLayout = async (layout) => {
  autoLayoutData.value = null;
  await nextTick();

  const { width: imageWidth, height: imageHeight } = document
    .getElementById('mark')
    .getBoundingClientRect();
  const { width: textWidth, height: textHeight } = document
    .getElementById('name')
    .getBoundingClientRect();
  console.log('ww', layout);
  if (layout === 'markTopTextBottom') {
    console.log('xxx');
    const logoWidth = Math.max(imageWidth, textWidth);
    const logoHeight = imageHeight + textHeight;

    const textX = textWidth >= imageWidth ? 0 : (logoWidth - textWidth) / 2;
    const textY = imageHeight;

    const imageY = 0;
    const imageX = imageWidth >= textWidth ? 0 : (logoWidth - imageWidth) / 2;

    autoLayoutData.value = {
      width: logoWidth,
      height: logoHeight,
      image: {
        x: imageX,
        y: imageY,
      },
      text: {
        x: textX,
        y: textY,
      },
    };
    console.log('xxx', autoLayoutData.value);
  }
  if (layout === 'markBottomTextTop') {
  }
  if (layout === 'markleftTextRight') {
  }
  if (layout === 'markRightTextLeft') {
  }
};

onMounted(() => {
  console.log(props.autoLayout);
  if (props.autoLayout) {
    document.fonts.onloading = async () => {
      await document.fonts.ready;
      computeAutoLayout(props.autolayout);
    };
  }
});
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
      :viewBox="getSVGProps(element.svgData)?.viewBox"
      :width="element.width"
      :height="element.height"
      :x="autoLayoutData?.[element.id].x || 0"
      :y="autoLayoutData?.[element.id].y || 0"
      v-html="getSVGProps(element.svgData)?.innerHTML"
    ></svg>
  </svg>
</template>

<style scoped lang="scss"></style>
