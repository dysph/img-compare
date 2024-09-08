import { createRouter, createWebHashHistory } from "vue-router";
import ColorHistogram from "../views/ColorHistogram.vue";
import Home from "../views/Home.vue";
import ImageSimilarity from "../views/ImageSimilarity.vue";
import IoU from "../views/IoU.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/image-similarity",
    name: "ImageSimilarity",
    component: ImageSimilarity,
  },
  {
    path: "/color-histogram",
    name: "ColorHistogram",
    component: ColorHistogram,
  },
  {
    path: "/iou",
    name: "IoU",
    component: IoU,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
