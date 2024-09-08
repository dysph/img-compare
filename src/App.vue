<template>
  <div id="app">
    <nav>
      <router-link to="/image-similarity" class="nav-link">Image Similarity</router-link> |
      <router-link to="/color-histogram" class="nav-link">Color Histogram</router-link> |
      <router-link to="/iou" class="nav-link">Intersection over Union</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
