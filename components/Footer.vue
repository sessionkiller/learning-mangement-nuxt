<script setup>
    const pages = ["About", "Privacy Policy", "Licensing", "Contact"];
    const year = new Date().getFullYear();

    const getLink = (item) => `/${item.toLocaleLowerCase().replace(" ", "-")}`;
</script>

<template>
    <div class="footer">
      <p>&copy; {{ year }} Learn.io. All Rights Reserved.</p>
      <div class="footer__links"> 
          <span
            v-for="item in pages"
            :key="item"
            class="footer__link"
          >
            {{item}}
      </span>
      </div>
    </div>
</template>