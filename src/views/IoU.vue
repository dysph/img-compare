<template>
  <div class="container">
    <h2>Intersection over Union (IoU)</h2>
    <div>
      <svg width="300" height="300" viewBox="0 0 300 300">
        <rect x="50" y="50" width="150" height="150" fill="#8080FF" opacity="0.7" />
        <rect x="100" y="100" width="150" height="150" fill="#FF8080" opacity="0.7" />
        <rect x="100" y="100" width="100" height="100" fill="#800080" opacity="0.7" />
        <text x="70" y="40" fill="black">Region A (Blue)</text>
        <text x="180" y="270" fill="black">Region B (Red)</text>
        <text x="106" y="170" fill="white" style="font-weight: bold">Intersection</text>
      </svg>
    </div>
    <div class="formula">
      <p style="font-size: 26px"></p>
      <VueLatex
        :fontsize="20"
        expression="\text{IoU} = \frac{\text{Area of Intersection}}{\text{Area of Union}} = \frac{\text{Area(Purple)}}{\text{Area(Blue)} + \text{Area(Red)} - \text{Area(Purple)}}"
        display-mode
      />
    </div>
  </div>
</template>

<script setup>
import { VueLatex } from "vatex";
</script>
