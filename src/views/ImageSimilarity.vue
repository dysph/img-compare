<template>
  <div class="container">
    <h2>Image Similarity</h2>
    <div class="description">
      <p>
        This image comparison feature utilizes
        <a href="https://github.com/rsmbl/Resemble.js" target="_blank">Resemble.js</a> to analyze and compare the visual
        differences between two images.
      </p>
    </div>
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
      <p>
        Similarity: <span id="similarity">{{ similarity.toFixed(2) }}%</span>
      </p>
      <img id="diffImage" :src="diffImageUrl" alt="Difference Image" />
    </div>
  </div>
</template>

<script setup>
import resemble from "resemblejs";
import { ref } from "vue";

const image1 = ref(null);
const image2 = ref(null);
const similarity = ref(null);
const diffImageUrl = ref(null);
const resultVisible = ref(false);

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

  const img1 = image1.value;
  const img2 = image2.value;

  resemble(img1)
    .compareTo(img2)
    .scaleToSameSize()
    .ignoreAntialiasing()
    .onComplete((data) => {
      similarity.value = 100 - parseFloat(data.misMatchPercentage);
      diffImageUrl.value = data.getImageDataUrl();
      resultVisible.value = true;
    });
};
</script>

<style scoped>
.description {
  margin-bottom: 20px;
  font-size: 1.1em;
  color: #555;
}

.description a {
  color: #007bff;
  text-decoration: none;
}

.description a:hover {
  text-decoration: underline;
}
</style>
