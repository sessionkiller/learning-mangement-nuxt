<script setup>
import { boolean, object, mixed } from "yup";

defineProps({
  title: String,
  subtitle: String,
});

const { user } = useUser();
const { updateUser } = useApi();

const currentSettings = user.value?.publicMetadata?.settings || {};

const schema = object({
  courseNotifications: boolean(),
  emailAlerts: boolean(),
  smsAlerts: boolean(),
  notificationFrequency: mixed().oneOf(["immediate", "daily", "weekly"]),
});

const { meta, handleSubmit, errors, resetForm, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    courseNotifications: currentSettings.courseNotifications || false,
    emailAlerts: currentSettings.emailAlerts || false,
    smsAlerts: currentSettings.smsAlerts || false,
    notificationFrequency: currentSettings.notificationFrequency || "daily",
  },
});

const [courseNotifications] = defineField("courseNotifications");
const [emailAlerts] = defineField("emailAlerts");
const [smsAlerts] = defineField("smsAlerts");
const [notificationFrequency] = defineField("notificationFrequency");

const submitForm = handleSubmit(async (values) => {
  if (!user) return;
  console.log(`handleSubmit (values): `, meta.value, values);
  if (meta.value.valid) {
    const updatedUser = {
      userId: user.id,
      publicMetadata: {
        ...user.publicMetadata,
        settings: {
          ...currentSettings,
          ...values,
        },
      },
    };

    try {
      updateUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user settings: ", error);
    }
  }
});

const notificationFrequencyOptions = ref([
  { value: "immediate", label: "Immediate" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
]);
</script>

<template>
  <div v-if="!user">Please sign in to manage your settings.</div>
  <div v-else class="notification-settings">
    <Header :title="title" :subtitle="subtitle" />
    <form @submit.prevent="submitForm" class="notification-settings__form">
      <div class="notification-settings__fields">
        <BaseFormField prop="courseNotifications">
          <label class="cursor-pointer flex items-center gap-2">
            <PToggleSwitch v-model="courseNotifications" />
            <span>Course Notifications</span>
          </label>
        </BaseFormField>
        <BaseFormField prop="emailAlerts">
          <label class="cursor-pointer flex items-center gap-2">
            <PToggleSwitch v-model="emailAlerts" />
            <span>Email Alerts</span>
          </label>
        </BaseFormField>
        <BaseFormField prop="smsAlerts">
          <label class="cursor-pointer flex items-center gap-2">
            <PToggleSwitch v-model="smsAlerts" />
            <span>SMS Alerts</span>
          </label>
        </BaseFormField>

        <BaseFormField
          prop="notificationFrequency"
          label="Notification Frequency"
        >
          <PSelect
            v-model="notificationFrequency"
            :options="notificationFrequencyOptions"
            option-label="label"
            option-value="value"
          />
        </BaseFormField>
      </div>

      <PButton
        label="Update Settings"
        type="submit"
        :disabled="!meta.dirty"
        class="notification-settings__submit"
      />
    </form>
  </div>
</template>
