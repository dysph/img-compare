<template>
  <div class="container">
    <h2>Color Histogram</h2>
    <div class="file-input-container">
      <input type="file" id="image1" @change="handleImageUpload(1, $event)" accept="image/*" />
      <input type="file" id="image2" @change="handleImageUpload(2, $event)" accept="image/*" />
    </div>
    <button @click="compareImages">Compare Images</button>
    <div id="preview">
      <img v-if="image1" :src="image1" alt="Uploaded Image 1" />
      <img v-if="image2" :src="image2" alt="Uploaded Image 2" />
    </div>
    <div id="result" v-if="resultVisible">
      <p>直方图交集 (Histogram Intersection): {{ histogramIntersectionResult.toFixed(3) }}</p>
      <p>巴氏距离 (Bhattacharyya Distance): {{ bhattacharyyaDistanceResult.toFixed(3) }}</p>
      <p>卡方检验 (Chi-Square Test): {{ chiSquareTestResult.toFixed(3) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Jimp } from "jimp";

const image1 = ref(null);
const image2 = ref(null);
const resultVisible = ref(false);
const histogramIntersectionResult = ref(null);
const bhattacharyyaDistanceResult = ref(null);
const chiSquareTestResult = ref(null);

const handleImageUpload = (imageNumber, event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (imageNumber === 1) {
        image1.value = e.target.result;
      } else if (imageNumber === 2) {
        image2.value = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
};

const compareImages = async () => {
  if (!image1.value || !image2.value) {
    alert("Please upload both images before comparing.");
    return;
  }

  const img1 = await Jimp.read(image1.value);
  const img2 = await Jimp.read(image2.value);

  const hist1 = calculateColorHistogram(img1);
  const hist2 = calculateColorHistogram(img2);

  histogramIntersectionResult.value = histogramIntersection(hist1, hist2);
  bhattacharyyaDistanceResult.value = bhattacharyyaDistance(hist1, hist2);
  chiSquareTestResult.value = chiSquareTest(hist1, hist2);

  resultVisible.value = true;
};

function calculateColorHistogram(image) {
  const histogram = {
    red: new Array(256).fill(0),
    green: new Array(256).fill(0),
    blue: new Array(256).fill(0),
  };

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const red = image.bitmap.data[idx + 0];
    const green = image.bitmap.data[idx + 1];
    const blue = image.bitmap.data[idx + 2];

    histogram.red[red]++;
    histogram.green[green]++;
    histogram.blue[blue]++;
  });

  const totalPixels = image.bitmap.width * image.bitmap.height;

  for (let i = 0; i < 256; i++) {
    histogram.red[i] /= totalPixels;
    histogram.green[i] /= totalPixels;
    histogram.blue[i] /= totalPixels;
  }

  return histogram;
}

// 直方图交集法 (Histogram Intersection)
// 该方法计算两个直方图每个 bin 的重叠部分，将其累加
// 为了得到归一化相似度，你可以将交集结果除以较小的直方图总和
function histogramIntersection(hist1, hist2) {
  let intersection = 0;

  for (let i = 0; i < 256; i++) {
    intersection +=
      Math.min(hist1.red[i], hist2.red[i]) +
      Math.min(hist1.green[i], hist2.green[i]) +
      Math.min(hist1.blue[i], hist2.blue[i]);
  }

  return intersection / 3; // 归一化到 [0, 1]
}

// 巴氏距离 (Bhattacharyya Distance)
// 该方法通过计算直方图的重叠来评估相似度，距离越小越相似
// 我们可以将其转换为相似度（例如，通过 1 - distance）
function bhattacharyyaDistance(hist1, hist2) {
  let sum = 0;

  for (let i = 0; i < 256; i++) {
    sum +=
      Math.sqrt(hist1.red[i] * hist2.red[i]) +
      Math.sqrt(hist1.green[i] * hist2.green[i]) +
      Math.sqrt(hist1.blue[i] * hist2.blue[i]);
  }

  return sum / 3;
}

// 卡方检验 (Chi-Square Test)
// 卡方检验计算每个 bin 的差异。结果越小越相似
function chiSquareTest(hist1, hist2) {
  let chiSquare = 0;

  for (let i = 0; i < 256; i++) {
    let redDiff = hist1.red[i] - hist2.red[i];
    let greenDiff = hist1.green[i] - hist2.green[i];
    let blueDiff = hist1.blue[i] - hist2.blue[i];

    chiSquare +=
      redDiff ** 2 / (hist1.red[i] + hist2.red[i] + 1e-10) +
      greenDiff ** 2 / (hist1.green[i] + hist2.green[i] + 1e-10) +
      blueDiff ** 2 / (hist1.blue[i] + hist2.blue[i] + 1e-10);
  }

  return 1 / (1 + chiSquare); // 归一化到 [0, 1] 的相似度值
}
</script>
