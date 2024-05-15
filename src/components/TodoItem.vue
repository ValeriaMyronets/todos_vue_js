<script>
import { onMounted, ref } from 'vue';

export default {
  name: 'TodoItem',
  props: {
    todo: Object,
  },
  emits: ['update', 'delete'],
  setup(props, { emit }) {
    const editing = ref(false);
    const newTitle = ref(props.todo.title);

    const toggle = () => {
      emit('update', {
        ...props.todo,
        completed: !props.todo.completed,
      });
    };

    const rename = () => {
      if (!editing.value) {
        return;
      }

      editing.value = false;

      if (newTitle.value === props.todo.title) {
        return;
      }

      if (newTitle.value === '') {
        remove();
        return;
      }

      emit('update', {
        ...props.todo,
        title: newTitle.value,
      });
    };

    const remove = () => {
      emit('delete');
    };

    const edit = () => {
      this.newTitle = this.todo.title;
      this.editing = true;
    };

    onMounted(() => {
      if (editing.value) {
        document.querySelector('.todo__title-field').focus();
      }
    });

    return {
      editing,
      newTitle,
      toggle,
      rename,
      remove,
      edit,
    };
  },
};
</script>

<template>
  <div class="todo" :class="{ completed: todo.completed }">
    <label class="todo__status-label">
      <input
        type="checkbox"
        class="todo__status"
        :checked="todo.completed"
        @change="toggle"
      />
    </label>

    <form v-if="editing" @submit.prevent="rename">
      <input
        type="text"
        class="todo__title-field"
        placeholder="Empty todo will be deleted"
        v-model.trim="newTitle"
        ref="title-field"
        @keyup.esc="editing = false"
        @blur="rename"
      />
    </form>

    <template v-else>
      <span class="todo__title" @dblclick="edit">
        {{ todo.title }}
      </span>

      <button
        class="todo__remove"
        @click="remove"
      >
        x
      </button>
    </template>

    <div class="modal overlay" :class="{ 'is-active': false }">
      <div class="modal-background has-background-white-ter"></div>
      <div class="loader"></div>
    </div>
  </div>
</template>

<style>
</style>