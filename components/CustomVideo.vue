<script setup>
defineProps({
    src: String
})

const video = ref(null);

const res = new Set();
const arr = Array();
const percent = 0.8;
let toWatch = 0;

function mediaWatched(curr) {
//   alert(`${curr}% of media watched`);
  emit('on-80%-played')
}

function handleMetadata(e) {
  toWatch = Math.ceil(video.value.duration * percent);
  for (let i = 1; i <= toWatch + 1; i++) {
    arr.push(i);
  }
}

function handleTimeupdate(e) {
  res.add(Math.ceil(video.value.currentTime));
  if (
    arr.every(function (n) {
      return res.has(n);
    })
  ) {
    // console.log(video.value.currentTime, video.value.duration);
    video.value.removeEventListener("timeupdate", handleTimeupdate);
    mediaWatched(
      Math.ceil((video.value.currentTime / video.value.duration) * 100)
    );
  }
}

const emit = defineEmits(['on-80%-played']);

onMounted(() => {
  video.value.addEventListener("loadedmetadata", handleMetadata);

  video.value.addEventListener("timeupdate", handleTimeupdate);
});

onUnmounted(() => {
  video.value.removeEventListener("loadedmetadata", handleMetadata);

  video.value.removeEventListener("timeupdate", handleTimeupdate);
});
</script>

<template>
  <video
    ref="video"
    :src="src"
    controls
    class="w-full h-full"
  />
</template>
