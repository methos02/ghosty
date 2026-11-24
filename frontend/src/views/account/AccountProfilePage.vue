<script setup>
import AccountLayout from '@/views/account/parts/AccountLayout.vue'
import AccountNotificationsSection from '@/views/account/parts/AccountNotificationsSection.vue'
import AccountProfileSection from '@/views/account/parts/AccountProfileSection.vue'
</script>

<template>
  <AccountLayout>
    <AccountProfileSection />
    <AccountNotificationsSection />
  </AccountLayout>
</template>
