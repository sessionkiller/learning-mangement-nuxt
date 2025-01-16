<script setup>
const { navigateToStep } = useCheckoutNavigation();
const { course, isLoading: isCourseLoading } = useCurrentCourse();
const { userId, isLoaded: isUserLoaded } = useAuth();
const clerk = useClerk();

const stripeLoaded = ref(false);

function update(state) {
  stripeLoaded.value = state;
}

provide("stripeLoaded", {
  stripeLoaded: readonly(stripeLoaded),
  update,
});

const handleSignOutAndNavigate = async () => {
  await clerk.value.signOut();
  navigateToStep(1);
};
</script>

<template>
  <Loading v-if="!isUserLoaded || isCourseLoading" />
  <div v-else-if="!userId">Please sign in to view this page!</div>
  <div v-else-if="!course">Course not found!</div>
  <div v-else class="payment">
    <div class="payment__container">
      <!-- Order Summary -->
      <div class="payment__preview">
        <CoursePreview :course="course" />
      </div>

      <!-- Payment Form -->
      <div class="payment__form-container">
        <StripePaymentForm :course="course" :user-id="userId" />
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="payment__actions">
      <PButton
        class="hover:bg-white-50/10"
        @click="handleSignOutAndNavigate"
        variant="outlined"
        type="button"
      >
        Switch Account
      </PButton>

      <PButton
        form="payment-form"
        type="submit"
        class="payment__submit"
        :disabled="!stripeLoaded"
      >
        Pay with Credit Card
      </PButton>
    </div>
  </div>
</template>
