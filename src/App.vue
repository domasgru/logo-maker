<script setup>
import { onMounted, computed, ref, nextTick } from 'vue';
import svg from './assets/vue.svg';
import Session from 'svg-text-to-path';
import { saveSvgAsPng } from 'save-svg-as-png';
import { mockLogoData } from './data';
import RenderingEngine from './components/RenderingEngine.vue';
import { getSVGProps } from './utils';

const data = ref(mockLogoData);

const logoName = computed(() => data.value.find(({ id }) => id === 'name'));
const updateLogoName = async (event) => {
  const elementIndex = data.value.findIndex(({ id }) => id === 'name');
  data.value[elementIndex].content = event.target.value;
  await nextTick();
  convertTextToSVG();
};

const updateNameFont = async (event) => {
  const elementIndex = data.value.findIndex(({ id }) => id === 'name');
  data.value[elementIndex].fontFamily = event.target.value;
  await nextTick();
  await convertTextToSVG();
};

const updateSymbolWidth = async (event) => {
  const elementIndex = data.value.findIndex(({ id }) => id === 'mark');
  data.value[elementIndex].width = event.target.value;
};

// Converting:
const isConvertingTextToSVG = ref(false);
const textConverterRef = ref();
const textConverterTextElementRef = ref();
const convertTextWidth = ref(null);
const convertTextHeight = ref(null);
const convertTextToSVG = async () => {
  if (isConvertingTextToSVG.value) {
    return;
  }

  isConvertingTextToSVG.value = true;
  await nextTick();
  const textBounding =
    textConverterTextElementRef.value.getBoundingClientRect();
  convertTextWidth.value = textBounding.width;
  convertTextHeight.value = textBounding.height;
  await nextTick();

  const session = new Session(textConverterRef.value, {
    googleApiKey: 'AIzaSyA7_DioSood5zPy7mlIVvxvDnLPWCETL24',
  });

  await session.replaceAll();
  const svgText = session.getSvgString();
  const { innerHTML } = getSVGProps(svgText);
  const elementIndex = data.value.findIndex(({ id }) => id === 'name');
  data.value[elementIndex].svgData = svgText;
  data.value[elementIndex].width = textBounding.width;
  data.value[elementIndex].height = textBounding.height;

  isConvertingTextToSVG.value = false;
  convertTextWidth.value = null;
  convertTextHeight.value = null;
};

const saveAsPNG = () => {
  saveSvgAsPng(document.querySelector('.main-svg'), 'logo.png');
};

onMounted(() => {
  convertTextToSVG();
  document.fonts.onloading = async () => {
    await document.fonts.ready;

    console.log('font loaded');
    convertTextToSVG();
  };
});
</script>

<template>
  <div class="container">
    <div class="settings">
      <select name="cars" id="cars" @input="updateNameFont" :value="'Roboto'">
        <option value="Mansalva">Mansalva</option>
        <option value="Rubik Gemstones">Rubik Gemstones</option>
        <option value="Roboto">Roboto</option>
        <option value="Sacramento">Sacramento</option>
      </select>
      <input :value="logoName.content" @input="updateLogoName" />
      <input
        type="range"
        id="volume"
        name="volume"
        min="10"
        max="500"
        :value="120"
        @input="updateSymbolWidth"
      />
      <button @click="saveAsPNG">download</button>
    </div>
    <RenderingEngine :data="data" auto-layout="markTopTextBottom" />
  </div>

  <!-- FONT to SVG rendering -->
  <template v-if="isConvertingTextToSVG">
    <svg
      ref="textConverterRef"
      xmlns="http://www.w3.org/2000/svg"
      :width="convertTextWidth"
      :height="convertTextHeight"
      :viewBox="`0 0 ${convertTextWidth} ${convertTextHeight}`"
      id="textConverter"
    >
      <rect x="0" y="0" width="100%" height="100%" fill="none"></rect>
      <text
        ref="textConverterTextElementRef"
        v-html="logoName.content"
        :font-size="logoName.fontSize"
        :font-family="logoName.fontFamily"
        dominant-baseline="text-before-edge"
      ></text>
    </svg>
  </template>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

.settings {
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.main-svg {
  outline: 1px solid #00000030;
  /* width: 300px;
  height: auto; */
}

#textConverter {
  position: absolute;
  visibility: hidden;
}
</style>
