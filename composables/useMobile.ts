const MOBILE_BREAKPOINT = 768

export function useMobile() {
    const isMobile = ref(false);
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
        isMobile.value = (window.innerWidth < MOBILE_BREAKPOINT)
      }
  
    onMounted(() => {
        mql.addEventListener("change", onChange)
    });
  
    onUnmounted(() => {
        mql.removeEventListener("change", onChange)
    });

    onChange()
  
    return isMobile;
  }
  
  