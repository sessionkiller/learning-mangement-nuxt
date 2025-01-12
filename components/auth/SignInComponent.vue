<script setup>
import { dark } from "@clerk/themes";

const { user } = useUser();
const { query: searchParams } = useRoute();

const isCheckoutPage = searchParams.showSignUp ?? false;
const courseId = searchParams.id;

console.log(searchParams);

const signUpUrl = isCheckoutPage
  ? `/checkout?step=1&id=${courseId}&showSignUp=true`
  : "/signup";

const getRedirectUrl = () => {
  if (isCheckoutPage) {
    return `/checkout?step=2&id=${courseId}&showSignUp=true`;
  }

  const userType = user.value?.publicMetadata?.userType;
  if (userType === "teacher") {
    return "/teacher/courses";
  }
  return "/user/courses";
};
</script>

<template>
  <SignIn
    :appearance="{
      baseTheme: dark,
      elements: {
        rootBox: 'flew justify-center items-center py-5',
        cardBox: 'shadow-none',
        card: 'bg-customgreys-secondarybg w-full shadow-none',
        footer: {
          background: '#25262F',
          padding: '0rem 2.5rem',
          '& > div > div:nth-child(1)': {
            background: '#25262F',
          },
        },
        formFieldLabel: 'text-white-50 font-normal',
        formButtonPrimary:
          'bg-primary-700 hover:bg-primary-600 text-white-100 !shadow-none',
        formFieldInput: 'bg-customgreys-primarybg text-white-50 !shadow-none',
        footerActionLink: 'text-primary-750 hover:text-primary-600',
      },
    }"
    :signUpUrl="signUpUrl"
    :forceRedirectUrl="getRedirectUrl()"
    routing="hash"
    afterSignOutUrl="/"
  />
</template>
