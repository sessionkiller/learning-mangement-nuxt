<script setup>
import { formatPrice } from "~/lib/utils";

const paymentType = ref("all");
const { userId, isLoaded } = useAuth();

const { getTransactions } = useApi();

const { data: transactions, isLoading: isLoadingTransactions } =
  getTransactions(userId);

const filteredData = computed(
  () =>
    transactions.value?.filter((transaction) => {
      const matchesTypes =
        paymentType.value === "all" ||
        transaction.paymentProvider === paymentType.value;
      return matchesTypes;
    }) || []
);

const paymentTypes = ref([
  { name: "All Types", value: "all" },
  { name: "Stripe", value: "stripe" },
  { name: "Paypal", value: "paypal" },
]);
</script>

<template>
  <Loading v-if="!isLoaded" />
  <div v-else-if="!userId">
    Please sign in to view your billing information.
  </div>
  <div v-else class="billing">
    <div class="billing__container">
      <h2 class="billing__title">Payment History</h2>
      <div class="billing__filters">
        <PSelect
          v-model="paymentType"
          :options="paymentTypes"
          optionLabel="name"
          optionValue="value"
          placeholder="Payment Type"
          class="billing__select"
        />
      </div>

      <div class="billing__grid">
        <Loading v-if="isLoadingTransactions" />
        <PDataTable v-else :value="filteredData" class="billing__table">
          <PColumn field="dateTime" header="Date">
            <template #body="slotProps">
              {{ new Date(slotProps.data.dateTime).toLocaleDateString() }}
            </template>
          </PColumn>
          <PColumn field="amount" header="Amount">
            <template #body="slotProps">
              {{ formatPrice(slotProps.data.amount) }}
            </template>
          </PColumn>
          <PColumn field="paymentProvider" header="Payment Method"></PColumn>
          <template #empty>
            <span class="billing__table-cell text-center">
              No transactions to display
            </span>
          </template>
        </PDataTable>
      </div>
    </div>
  </div>
</template>
