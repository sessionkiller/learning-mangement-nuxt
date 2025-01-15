<script setup>
import { object, string } from "yup";

const { course: selectedCourse, isLoading, isError } = useCurrentCourse();
const { query: searchParams } = useRoute();
const showSignUp = searchParams.showSignUp === "true";

const schema = object({
  email: string().email("Invalid email address"),
});

const { meta, handleSubmit, defineField } = useForm({
  validationSchema: schema,
});

const [email] = defineField("email");

const submitForm = handleSubmit(async (values) => {
  console.log(`handleSubmit (values): `, meta.value, values);
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div v-else-if="isError">Failed to fetch course data</div>
  <div v-else-if="!selectedCourse">Course not found</div>
  <div v-else class="checkout-details">
    <div class="checkout-details__container">
      <div class="checkout-details__preview">
        <CoursePreview :course="selectedCourse" />
      </div>

      <div class="checkout-details__options">
        <div class="checkout-details__guest">
          <h2 class="checkout-details__title">Guest Checkout</h2>
          <p class="checkout-details__subtitle">
            Enter email to receive course access details and order confirmation.
            You can create an account after purchase.
          </p>
          <form @submit.prevent="submitForm" class="checkout-details__form">
            <BaseFormField prop="email" label="Email address">
              <PInputText
                type="email"
                v-model="email"
                class="w-full rounded mt-4"
              />
            </BaseFormField>

            <PButton type="submit" class="checkout-details__submit">
              Continue as Guest
            </PButton>
          </form>
        </div>

        <div class="checkout-details__divider">
          <hr class="checkout-details__divider-line" />
          <span class="checkout-details__divider-text">Or</span>
          <hr class="checkout-details__divider-line" />
        </div>

        <div class="checkout-details__auth">
          <SignUpComponent v-if="showSignUp" />
          <SignInComponent v-else />
        </div>
      </div>
    </div>
  </div>
</template>
