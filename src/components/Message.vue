<script>
import { ref } from 'vue';

export default {
  setup() {
    const text = ref('');

    const hide = () => {
      text.value = '';
    }

    const show = (newText) => {
      text.value = newText;
    }

    return {
      text,
      hide,
      show,
    }
  },
}
</script>

<template>
  <article
    class="message"
    :class="{ 'message--hidden': !text }"
  >
    <div class="message-header">
      <slot name="header"></slot>
      <button class="delete" @click="hide"></button>
    </div>

    <div class="message-body">
      <slot :text="text.value">Message</slot>
    </div>
  </article>
</template>