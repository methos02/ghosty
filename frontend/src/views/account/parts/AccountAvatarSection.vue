<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import ConfirmButtonComponent from '@/components/ConfirmButtonComponent.vue'
import ErrorFormComponent from '@/services/form/views/ErrorFormComponent.vue'
import ImageCropper from '@/views/parts/ImageCropper.vue'
import { AccountController } from '@/apis/account/controllers/account-controller.js'
import { validateAvatarCropForm } from '@/apis/account/formRequest/avatar-crop-form-request.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'
import { imageFileHelper } from '@/core/helpers/image-file-helper.js'

const authStore = useAuthStore()

const input = ref()
const source = ref()
const crop = ref()
const isProcessing = ref(false)

const release = () => {
  if (source.value) {
    source.value.bitmap.close?.()
    URL.revokeObjectURL(source.value.url)
  }

  source.value = undefined
  crop.value = undefined
}

const load = async file => {
  isProcessing.value = true
  release()

  const image = await imageFileHelper.decode(file)
  if (!validateAvatarCropForm(image).valid) {
    image.bitmap?.close?.()
    isProcessing.value = false
    return
  }

  source.value = {
    url: URL.createObjectURL(file),
    bitmap: image.bitmap,
    size: {
      width: image.width,
      height: image.height,
    },
    format: ConfigLoader.get('account.avatar'),
  }
  crop.value = imageCropHelper.fullCrop(source.value)
  isProcessing.value = false
}

const openPicker = () => {
  input.value.click()
}

const pickFromInput = async event => {
  const [file] = event.target.files
  event.target.value = ''

  if (file !== undefined) {
    await load(file)
  }
}

const hasPendingImage = () => source.value !== undefined

const renderPendingImage = async () => {
  return await imageFileHelper.renderCrop(source.value.bitmap, crop.value, source.value.format)
}

const deleteAvatar = async () => {
  const response = await AccountController.deleteAvatar()
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  authStore.setUser(response.user)
  flash.successT('account_avatar_section.deleted')
}

defineExpose({
  hasPendingImage,
  renderPendingImage,
  release,
})

onBeforeUnmount(release)
</script>

<template>
  <div class="account-avatar-section | d-flex f-column a-center g-10">
    <input
      ref="input"
      type="file"
      name="image"
      accept="image/jpeg,image/png,image/webp"
      class="account-avatar-section__input | d-none"
      @change="pickFromInput"
    />

    <ImageCropper
      v-if="source"
      :imageUrl="source.url"
      :source="source"
      :initialCrop="crop"
      :withHint="false"
      :withApply="false"
      class="account-avatar-section__cropper | w-100"
      @change="crop = $event"
      @cancel="release"
    />

    <template v-else>
      <button
        type="button"
        class="account-avatar-section__picker | pointer"
        :title="t('account_avatar_section.choose')"
        :aria-label="t('account_avatar_section.choose')"
        :disabled="isProcessing"
        @click="openPicker"
      >
        <img
          v-if="authStore.user.value.avatarUrl"
          :src="authStore.user.value.avatarUrl"
          :alt="t('account_avatar_section.current')"
          class="account-avatar-section__avatar"
        />
        <span
          v-else
          class="account-avatar-section__avatar account-avatar-section__avatar--empty | d-flex a-center j-center"
        >
          <i class="account-avatar-section__icon | fa-solid fa-user"></i>
        </span>
        <span class="account-avatar-section__overlay | d-flex a-center j-center">
          <i
            v-if="isProcessing"
            class="account-avatar-section__icon | fa-solid fa-spinner fa-spin"
          ></i>
          <i
            v-else
            class="account-avatar-section__icon | fa-solid fa-camera"
          ></i>
        </span>
      </button>

      <ConfirmButtonComponent
        v-if="authStore.user.value.avatarUrl"
        :cb="deleteAvatar"
        :question="t('account_avatar_section.delete_confirm')"
        buttonClasses="account-avatar-section__delete | btn btn-sm btn-danger-alt"
      >
        {{ t('account_avatar_section.delete') }}
      </ConfirmButtonComponent>
    </template>

    <ErrorFormComponent name="accountProfile.image" />
  </div>
</template>

<style lang="scss" scoped>
$avatar-size: 180px;

.account-avatar-section {
  --image-cropper-round-size: #{$avatar-size};

  &__picker {
    position: relative;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: none;
  }

  &__avatar {
    width: $avatar-size;
    height: $avatar-size;
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;

    &--empty {
      background-color: var(--neutral-300);
      color: var(--neutral-700);
    }
  }

  &__icon {
    font-size: 2.5rem;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background-color: rgb(0 0 0 / 0.45);
    color: var(--neutral-100);
    opacity: 0;
    transition: opacity 200ms;
  }

  &__picker:hover &__overlay,
  &__picker:focus-visible &__overlay,
  &__picker:disabled &__overlay {
    opacity: 1;
  }
}
</style>
