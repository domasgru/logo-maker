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
  await convertTextToSVG();
};

const updateSymbolWidth = async (event) => {
  const elementIndex = data.value.findIndex(({ id }) => id === 'mark');
  data.value[elementIndex].width = event.target.value;
};

// Converting:
const isConvertingTextToSVG = ref(true);
const convertTextWidth = ref(null);
const convertTextHeight = ref(null);
const convertTextToSVG = async () => {
  const text = document.querySelector('#textConverter');

  const textEl = document.querySelector('#textEl');
  textEl.removeAttribute('id');

  const textBounding = textEl.getBoundingClientRect();
  convertTextWidth.value = textBounding.width;
  convertTextHeight.value = textBounding.height;
  await nextTick();

  const session = new Session(text, {
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
  await nextTick();

  isConvertingTextToSVG.value = true;
  convertTextWidth.value = null;
  convertTextHeight.value = null;
};

const updateNameFont = async (event) => {
  const elementIndex = data.value.findIndex(({ id }) => id === 'name');
  data.value[elementIndex].fontFamily = event.target.value;
  await nextTick();
  await convertTextToSVG();
};

const saveAsPNG = () => {
  saveSvgAsPng(document.querySelector('.main-svg'), 'logo.png');
};

onMounted(() => {
  convertTextToSVG();
});
</script>

<template>
  <div class="container">
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
      min="60"
      max="200"
      :value="120"
      @input="updateSymbolWidth"
    />
    <button @click="saveAsPNG">download</button>
    <RenderingEngine :data="data" auto-layout="markTopTextBottom" />
  </div>

  <!-- FONT to SVG rendering -->
  <template v-if="isConvertingTextToSVG">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="convertTextWidth"
      :height="convertTextHeight"
      :viewBox="`0 0 ${convertTextWidth} ${convertTextHeight}`"
      id="textConverter"
    >
      <rect x="0" y="0" width="100%" height="100%" fill="none"></rect>
      <text
        id="textEl"
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
.main-svg {
  outline: 3px solid green;
  width: 300px;
  height: auto;
}

#textConverter {
  position: absolute;
  visibility: hidden;
}
</style>
