export const getSVGProps = (svg) => {
  try {
    const parser = new DOMParser();
    const { documentElement } = parser.parseFromString(svg, 'image/svg+xml');
    return {
      viewBox: `0 0 ${documentElement.viewBox.baseVal.width} ${documentElement.viewBox.baseVal.height}`,
      innerHTML: documentElement.innerHTML,
      aspectRatio:
        documentElement.viewBox.baseVal.height /
        documentElement.viewBox.baseVal.width,
    };
  } catch (e) {
    //console.error(e);
  }
};
