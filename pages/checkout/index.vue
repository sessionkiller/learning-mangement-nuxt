<script setup>
const { isLoaded } = useAuth();
const { checkoutStep, path } = useCheckoutNavigation();
</script>

<template>
  <Loading v-if="!isLoaded" />
  <div v-else class="checkout" :key="path">
    <WizardStepper :currentStep="checkoutStep" />
    <div class="checkout__content">
      <PaymentPage v-if="checkoutStep === 2" />
      <CompletionPage v-else-if="checkoutStep === 3" />
      <CheckoutDetailsPage v-else />
    </div>
  </div>
</template>
