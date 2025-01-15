<script setup>
import { cn } from "~/lib/utils";

defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
});

const steps = [1, 2, 3];
</script>

<template>
  <div class="wizard-stepper">
    <div class="wizard-stepper__container">
      <template v-for="(step, index) in steps" :key="{ step }">
        <div class="wizard-stepper__step">
          <div
            :class="
              cn(
                'wizard-stepper__circle',
                (currentStep > step || (currentStep === 3 && step === 3)) &&
                  'wizard-stepper__circle--completed',
                currentStep === step &&
                  step !== 3 &&
                  'wizard-stepper__circle--current',
                currentStep < step && 'wizard-stepper__circle--upcoming'
              )
            "
          >
            <IconCheck
              v-if="currentStep > step || (currentStep === 3 && step === 3)"
              class="w-5 h-5"
            />

            <span v-else>{{ step }}</span>
          </div>
          <p
            :class="
              cn(
                'wizard-stepper__text',
                currentStep >= step && 'wizard-stepper__text--active',
                currentStep < step && 'wizard-stepper__text--inactive'
              )
            "
          >
            {{ step === 1 ? "Details" : step === 2 ? "Payment" : "Completion" }}
          </p>
        </div>

        <div
          v-if="index < 2"
          :class="
            cn(
              'wizard-stepper__line',
              currentStep > step && 'wizard-stepper__line--completed',
              currentStep <= step && 'wizard-stepper__line--incomplete'
            )
          "
        />
      </template>
    </div>
  </div>
</template>
