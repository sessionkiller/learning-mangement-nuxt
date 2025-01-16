<script setup lang="ts">
import { loadStripe } from "@stripe/stripe-js";
import { StripeElements, StripeElement } from "vue-stripe-js";

import type {
  StripeElementsOptionsMode,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";

type StripeLoadedCustom = {
  stripeLoaded: Readonly<globalThis.Ref<boolean, boolean>>;
  update: (state: any) => void;
};

const props = defineProps<{ course: Course; userId: string }>();

const { createTransaction, createStripePaymentIntent } = useApi();
const { navigateToStep } = useCheckoutNavigation();
const toast = useToast();
const { stripePublicKey, localUrl, vercelUrl } = useRuntimeConfig().public;
const stripeOptions = ref({
  // https://stripe.com/docs/js/initializing#init_stripe_js-options
});
const elementsOptions = ref<StripeElementsOptionsMode>({
  // https://stripe.com/docs/js/elements_object/create#stripe_elements-options
  mode: "payment",
  amount: props.course?.price,
  currency: "usd",
  appearance: {
    theme: "stripe",
    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#18181b",
      colorText: "#d2d2d2",
      colorDanger: "#df1b41",
      colorTextPlaceholder: "#6e6e6e",
      fontFamily: "Inter, system-ui, sans-serif",
      spacingUnit: "3px",
      borderRadius: "10px",
      fontSizeBase: "14px",
    },
  },
});
const paymentElementOptions = ref<StripePaymentElementOptions>({
  // https://docs.stripe.com/js/elements_object/create_payment_element#payment_element_create-options
});

const clientSecret = ref("");

const { stripeLoaded, update: updateStripeLoadedState } =
  inject<StripeLoadedCustom>("stripeLoaded")!;

// Define component refs
const elementsComponent = ref();
const paymentComponent = ref();

onBeforeMount(() => {
  loadStripe(stripePublicKey).then(async () => {

    // Good place to call your backend to create PaymentIntent
    try {
      const result = await createStripePaymentIntent.mutateAsync({
        amount: props.course?.price ?? 9999999999999,
      });

      clientSecret.value = (result as { clientSecret: string }).clientSecret;
      updateStripeLoadedState(true);
    } catch (error) {
      console.log("Failed to create payment intent", error);
    }
  });
});

async function handleSubmit() {
  // Confirm the PaymentIntent using the details collected by the Payment Element
  const stripeInstance = elementsComponent.value?.instance;
  const elements = elementsComponent.value?.elements;

  if (!stripeInstance || !elements) {
    toast.add({
      severity: "error",
      detail: "Stripe service is not available",
      life: 3000,
    });
    return;
  }

  // Trigger form validation and wallet collection
  const {error: submitError} = await elements.submit();
  if (submitError) {
    toast.add({
      severity: "error",
      detail: submitError.message,
      life: 3000,
    });
    return;
  }

  const baseUrl = localUrl
    ? `http://${localUrl}`
    : vercelUrl
    ? `https://${vercelUrl}`
    : undefined;

  const { error, paymentIntent } = await stripeInstance.confirmPayment({
    elements,
    clientSecret: clientSecret.value,
    confirmParams: {
      return_url: `${baseUrl}/checkout?step=3&id=${props.course.courseId}`,
    },
    redirect: "if_required",
  });

  if (paymentIntent?.status === "succeeded") {
    const transactionData: Partial<Transaction> = {
      transactionId: paymentIntent.id,
      userId: props.userId,
      courseId: props.course.courseId,
      paymentProvider: "stripe",
      amount: props.course?.price || 0,
    };

    createTransaction.mutate(transactionData, {
      onSuccess() {
        navigateToStep(3);
      },
    });
  }

  if (error) {
    // This point is only reached if there's an immediate error when
    // confirming the payment. Show the error to your customer (for example, payment details incomplete)
    console.log(error);
  } else {
    // Your customer is redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer is redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
  }
}
</script>

<template>
  <form
    id="payment-form"
    v-if="stripeLoaded"
    @submit.prevent="handleSubmit"
    class="payment__form"
  >
    <div class="payment__content">
      <h1 class="payment__title">Checkout</h1>
      <p class="payment__subtitle">
        Fill out the payment details below to complete your purchase.
      </p>

      <div class="payment__method">
        <h3 class="payment__method-title">Payment Method</h3>
        <div class="payment__card-container">
          <div class="payment__card-header">
            <IconCreditCard />
            <span>Credit/Debit Card</span>
          </div>
          <div class="payment__card-element">
            <StripeElements
              :stripe-key="stripePublicKey"
              :instance-options="stripeOptions"
              :elements-options="elementsOptions"
              ref="elementsComponent"
            >
              <StripeElement
                type="payment"
                :options="paymentElementOptions"
                ref="paymentComponent"
              />
            </StripeElements>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
