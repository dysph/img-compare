<template>
  <div class="container">
    <h2>Intersection over Union (IoU)</h2>
    <div class="interactive-area" @mousemove="handleMouseMove" @mouseup="handleMouseUp">
      <p style="font-size: 22px; font-weight: bold; background-color: #ccc; margin: 0 auto">
        IoU: {{ iou.toFixed(2) }}
      </p>
      <div
        class="box"
        :style="{ left: box1Position.x + 'px', top: box1Position.y + 'px' }"
        @mousedown="handleMouseDown($event, 1)"
      >
        <div class="box-content" :style="{ backgroundColor: '#8080FF', opacity: 0.7 }"></div>
      </div>
      <div
        class="box"
        :style="{ left: box2Position.x + 'px', top: box2Position.y + 'px' }"
        @mousedown="handleMouseDown($event, 2)"
      >
        <div class="box-content" :style="{ backgroundColor: '#FF8080', opacity: 0.7 }"></div>
      </div>
    </div>
    <div class="formula">
      <VueLatex
        :fontsize="20"
        expression="\text{IoU} = \frac{\text{Area of Intersection}}{\text{Area of Union}} = \frac{\text{Area(Purple)}}{\text{Area(Blue)} + \text{Area(Red)} - \text{Area(Purple)}}"
        display-mode
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { VueLatex } from "vatex";

const box1Position = ref({ x: 200, y: 50 });
const box2Position = ref({ x: 400, y: 120 });
const draggingBox = ref(null);
const dragOffset = ref({ x: 0, y: 0 });

const boxWidth = 150;
const boxHeight = 150;

const handleMouseDown = (event, boxNumber) => {
  draggingBox.value = boxNumber;
  dragOffset.value = {
    x: event.clientX - (boxNumber === 1 ? box1Position.value.x : box2Position.value.x),
    y: event.clientY - (boxNumber === 1 ? box1Position.value.y : box2Position.value.y),
  };
};

const handleMouseMove = (event) => {
  if (draggingBox.value === 1) {
    let newX = event.clientX - dragOffset.value.x;
    let newY = event.clientY - dragOffset.value.y;

    // 边界检查
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + boxWidth > 800) newX = 800 - boxWidth;
    if (newY + boxHeight > 400) newY = 400 - boxHeight;

    box1Position.value = { x: newX, y: newY };
  } else if (draggingBox.value === 2) {
    let newX = event.clientX - dragOffset.value.x;
    let newY = event.clientY - dragOffset.value.y;

    // 边界检查
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + boxWidth > 800) newX = 800 - boxWidth;
    if (newY + boxHeight > 400) newY = 400 - boxHeight;

    box2Position.value = { x: newX, y: newY };
  }
};

const handleMouseUp = () => {
  draggingBox.value = null;
};

const intersectionArea = computed(() => {
  const xOverlap = Math.max(
    0,
    Math.min(box1Position.value.x + boxWidth, box2Position.value.x + boxWidth) -
      Math.max(box1Position.value.x, box2Position.value.x)
  );
  const yOverlap = Math.max(
    0,
    Math.min(box1Position.value.y + boxHeight, box2Position.value.y + boxHeight) -
      Math.max(box1Position.value.y, box2Position.value.y)
  );
  return xOverlap * yOverlap;
});

const unionArea = computed(() => {
  return boxWidth * boxHeight + boxWidth * boxHeight - intersectionArea.value;
});

const iou = computed(() => {
  return intersectionArea.value / unionArea.value;
});
</script>

<style scoped>
.interactive-area {
  position: relative;
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.box {
  position: absolute;
  width: 150px;
  height: 150px;
  cursor: move;
}

.box-content {
  width: 100%;
  height: 100%;
  opacity: 0.7;
  mix-blend-mode: multiply;
}

.formula {
  margin-top: 20px;
}
</style>
