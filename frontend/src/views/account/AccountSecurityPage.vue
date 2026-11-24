<script setup>
import AccountDeletionSection from '@/views/account/parts/AccountDeletionSection.vue'
import AccountEmailSection from '@/views/account/parts/AccountEmailSection.vue'
import AccountLayout from '@/views/account/parts/AccountLayout.vue'
import AccountPasswordSection from '@/views/account/parts/AccountPasswordSection.vue'
</script>

<template>
  <AccountLayout>
    <AccountEmailSection />
    <AccountPasswordSection />
    <AccountDeletionSection />
  </AccountLayout>
</template>
