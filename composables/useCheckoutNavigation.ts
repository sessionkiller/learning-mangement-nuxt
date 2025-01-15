export const useCheckoutNavigation = () => {
  const router = useRouter();
  const route = useRoute();
  const { isLoaded, isSignedIn } = useUser();

  const searchParams = route.query

  const courseId = searchParams.id ?? "";
  const checkoutStep = ref(parseInt((searchParams.step as string) ?? "1", 10));

  const navigateToStep = (step: number) => {
    const newStep = Math.min(Math.max(step, 1), 3);
    const showSignUp = isSignedIn ? "true" : "false";

    router.push(
      `/checkout?step=${newStep}&id=${courseId}&showSignUp=${showSignUp}`
    );
  };

  watch(route, (newRoute) => {
    console.log('searchparams changed');
    checkoutStep.value = parseInt((newRoute.query.step as string) ?? "1", 10)
});

  watch(
    [isLoaded, isSignedIn, checkoutStep],
    ([newIsLoaded, newIsSignedIn, newCheckoutStep]) => {
      if (newIsLoaded && !newIsSignedIn && newCheckoutStep > 1) {
        navigateToStep(1);
      }
    },
    { immediate: true }
  );

  return { checkoutStep, navigateToStep };
};
