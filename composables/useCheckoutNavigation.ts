export const useCheckoutNavigation = () => {
  const router = useRouter();
  const route = useRoute();
  const { isLoaded, isSignedIn } = useUser();

  const courseId = route.query.id ?? "";
  const checkoutStep = ref(1);
  const path = ref("");

  const navigateToStep = (step: number) => {
    const newStep = Math.min(Math.max(step, 1), 3);
    const showSignUp = isSignedIn ? "true" : "false";

    router.push(
      `/checkout?step=${newStep}&id=${courseId}&showSignUp=${showSignUp}`
    );
  };

  watch(
    route,
    (newRoute) => {
      checkoutStep.value = parseInt((newRoute.query.step as string) ?? "1", 10);
      path.value = newRoute.fullPath;
    },
    { immediate: true }
  );

  watch(
    [isLoaded, isSignedIn, checkoutStep],
    ([newIsLoaded, newIsSignedIn, newCheckoutStep]) => {
      if (newIsLoaded && !newIsSignedIn && newCheckoutStep > 1) {
        navigateToStep(1);
      }
    },
    { immediate: true }
  );

  return { checkoutStep, path, navigateToStep };
};
