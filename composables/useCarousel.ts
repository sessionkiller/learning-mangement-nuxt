interface useCarouselProps {
  totalImages: number;
  interval?: number;
}

export function useCarousel({ totalImages, interval = 5000 }: useCarouselProps) {
  const currentImage = ref(0);
  let timer : any;

  const startCarousel = () => {
    timer = setInterval(() => {
      currentImage.value = (currentImage.value + 1) % totalImages;
    }, interval);
  };

  const stopCarousel = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  onMounted(() => {
    startCarousel();
  });

  onUnmounted(() => {
    stopCarousel();
  });

  return currentImage;
}

