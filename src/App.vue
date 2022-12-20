<script setup>
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from '@svgdotjs/svg.js';
import { onMounted, computed, ref, nextTick } from 'vue';
import svg from './assets/vue.svg';
import Session from 'svg-text-to-path';
import { saveSvgAsPng } from 'save-svg-as-png';
import { mockLogoData } from './data';

//--STATE:
//----dynamic logo data
const data = ref(mockLogoData);

//----dynamic logo layout
// autocalculated logo layout (width, height, element position)
const logoLayout = ref(null);

const getSVGProps = (svg) => {
  const parser = new DOMParser();
  const { documentElement } = parser.parseFromString(svg, 'image/svg+xml');
  return {
    viewBox: `0 0 ${documentElement.viewBox.baseVal.width} ${documentElement.viewBox.baseVal.height}`,
    innerHTML: documentElement.innerHTML,
    aspectRatio:
      documentElement.viewBox.baseVal.height /
      documentElement.viewBox.baseVal.width,
  };
};

const logoName = computed(() => data.value.find(({ id }) => id === 'name'));

const updateLogoName = async (event) => {
  const elementIndex = data.value.findIndex(({ id }) => id === 'name');
  data.value[elementIndex].content = event.target.value;
  await nextTick();
  await convertTextToSVG();
  computeLogoLayout1();
};

const updateSymbolWidth = async (event) => {
  console.log(event.target.value);
  const elementIndex = data.value.findIndex(({ id }) => id === 'mark');
  data.value[elementIndex].width = event.target.value;
  await nextTick();
  computeLogoLayout1();
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
  console.log(textEl, textBounding);
  await nextTick();

  const session = new Session(text, {
    googleApiKey: 'AIzaSyA7_DioSood5zPy7mlIVvxvDnLPWCETL24',
  });

  await session.replaceAll();
  const svgText = session.getSvgString();
  const { innerHTML } = getSVGProps(svgText);
  const elementIndex = data.value.findIndex(({ id }) => id === 'name');
  data.value[elementIndex].svgContent = innerHTML;
  data.value[elementIndex].svgWidth = textBounding.width;
  data.value[elementIndex].svgHeight = textBounding.height;

  isConvertingTextToSVG.value = false;
  await nextTick();
  computeLogoLayout1();

  await nextTick();
  // reset
  isConvertingTextToSVG.value = true;
  convertTextWidth.value = null;
  convertTextHeight.value = null;
};

const updateNameFont = async (event) => {
  const elementIndex = data.value.findIndex(({ id }) => id === 'name');
  data.value[elementIndex].fontFamily = event.target.value;
  await nextTick();
  await convertTextToSVG();
  computeLogoLayout1();
};

// Layouting:

const computeLogoLayout1 = async () => {
  logoLayout.value = null;
  await nextTick();

  const imageBounding = document.getElementById('mark').getBoundingClientRect();
  const textBounding = document.getElementById('name').getBoundingClientRect();

  const logoWidth = Math.max(imageBounding.width, textBounding.width);
  const logoHeight = imageBounding.height + textBounding.height;

  const textX = 0;
  const textY = imageBounding.height;

  const imageY = 0;
  const imageX = (logoWidth - imageBounding.width) / 2;

  logoLayout.value = {
    width: logoWidth,
    height: logoHeight,
    imageX,
    imageY,
    textX,
    textY,
  };
};

const saveAsPNG = () => {
  saveSvgAsPng(document.querySelector('.main-svg'), 'logo.png');
};

onMounted(async () => {
  document.fonts.onloading = async () => {
    console.log('loading');
    await document.fonts.ready;
    console.log('ready');

    await convertTextToSVG();
    computeLogoLayout1();
  };
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

    <svg
      class="main-svg"
      xmlns="http://www.w3.org/2000/svg"
      :width="logoLayout?.width || null"
      :height="logoLayout?.height || null"
      :viewBox="
        logoLayout ? `0 0 ${logoLayout.width} ${logoLayout.height}` : null
      "
    >
      <template v-for="element in data" :key="element.id">
        <svg
          v-if="element.type === 'svg'"
          :id="element.id"
          :viewBox="getSVGProps(element.content).viewBox"
          :width="element.width"
          :height="element.width * getSVGProps(element.content).aspectRatio"
          :x="logoLayout?.imageX || 0"
          :y="logoLayout?.imageY || 0"
          v-html="getSVGProps(element.content).innerHTML"
        ></svg>
        <svg
          v-if="element.type === 'text' && !element.svgContent"
          :id="element.id"
          :x="logoLayout?.textX || 0"
          :y="logoLayout?.textY || 0"
        >
          <text
            :key="element.id"
            v-html="element.content"
            :font-size="element.fontSize"
            :font-family="element.fontFamily"
            dominant-baseline="text-before-edge"
          ></text>
        </svg>
        <svg
          v-if="element.type === 'text' && element.svgContent"
          :id="element.id"
          :width="element.svgWidth"
          :height="element.svgHeight"
          :viewBox="`0 0 ${element.svgWidth} ${element.svgHeight}`"
          :x="logoLayout?.textX || 0"
          :y="logoLayout?.textY || 0"
          v-html="element.svgContent"
        ></svg>
      </template>
    </svg>
  </div>

  <!-- Font rendering start -->
  <button v-show="true" @click="convertTextToSVG()">Convert text to SVG</button>
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
  <!-- Font rendering end -->
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.main-svg {
  outline: 3px solid green;
  /* width: 400px;
  height: auto; */
}

#textConverter {
  /* position: absolute;
  visibility: hidden; */
}
</style>
