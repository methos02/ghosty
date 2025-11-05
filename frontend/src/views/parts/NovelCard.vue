<script setup>
const props = defineProps({
  novel: { type: Object, required: true  }
})
</script>

<template>
  <div class="novel-card | overflow-hidden radius-4 pointer">
    <div class="novel-card__image-container | relative">
      <img
        :src="novel.coverUrl"
        :alt="novel.title"
        class="novel-card__image | w-100 h-100"
      />

      <div class="novel-card__overlay | absolute"></div>

      <div class="novel-card__border | absolute"></div>

      <h3 class="novel-card__title | absolute color-white fw-700">
        {{ novel.title }}
      </h3>

      <div class="novel-card__badge | absolute">
        <span class="novel-card__genre">
          {{ novel.genre.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.novel-card {
  background: transparent;
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
  }

  &:hover &__image {
    transform: scale(1.1);
  }

  &__image-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    position: relative;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 0.3s ease;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 50%, transparent 100%);
    pointer-events: none;
  }

  &__border {
    position: absolute;
    top: 5.16px;
    left: 9.17px;
    right: 9.17px;
    bottom: 5.16px;
    border: 3px solid #00bc7d;
    border-radius: 4px;
    pointer-events: none;
  }

  &__title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 22px;
    line-height: 33px;
    text-align: center;
    color: white;
    text-shadow: #000000 1px 1px, #000000 -1px 1px, #000000 -1px -1px, #000000 1px -1px;
    white-space: nowrap;
    max-width: 85%;
    overflow: hidden;
    text-overflow: ellipsis;
    z-index: 2;
  }

  &__badge {
    position: absolute;
    bottom: 5.16px;
    left: 9.17px;
    background-color: #00bc7d;
    padding: 4px 12px 8px 12px;
    border-bottom-left-radius: 8px;
    border-top-right-radius: 8px;
    z-index: 2;
  }

  &__genre {
    font-size: 17.6px;
    line-height: 23.467px;
    font-family: Arial, sans-serif;
    color: white;
  }
}
</style>
