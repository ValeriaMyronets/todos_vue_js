<script>
import { ref, computed, onMounted } from 'vue';
import * as todosApi from './api/todos';
import StatusFilter from './components/StatusFilter.vue';
import TodoItem from './components/TodoItem.vue';
import Message from './components/Message.vue';

export default {
  components: {
    StatusFilter,
    TodoItem,
    Message,
  },
  setup() {
    const todos = ref([]);
    const title = ref('');
    const status = ref('all');
    const errorMessage = ref('');

    const activeTodos = computed(() => todos.value.filter(todo => !todo.completed));
    const completedTodos = computed(() => todos.value.filter(todo => todo.completed));
    const visibleTodos = computed(() => {
      switch (status.value) {
        case 'active':
          return activeTodos.value;

        case 'completed':
          return completedTodos.value;

        default:
          return todos.value;
      }
    });

    const addTodo = () => {
      todosApi.createTodo(title.value)
        .then(({ data }) => {
          todos.value = [...todos.value, data];
          title.value = '';
        });
    };

    const updateTodo = ({ id, title, completed }) => {
      todosApi.updateTodo({ id, title, completed })
        .then(({ data }) => {
          todos.value = todos.value.map(todo => (todo.id !== id ? todo : data));
        });
    };

    const deleteTodo = (todoId) => {
      todosApi.deleteTodo(todoId)
        .then(() => {
          todos.value = todos.value.filter(todo => todo.id !== todoId);
        });
    };

    const completedAllTodos = () => {
      todos.value.map(todo => {
        if (!todo.completed) {
          updateTodo({ ...todo, completed: true });
        }
      });
    };

    const deleteCompletedTodos = () => {
      completedTodos.value.forEach(todo => deleteTodo(todo.id));
    };

    onMounted(() => {
      todosApi.getTodos()
        .then(({ data }) => {
          todos.value = data;
        })
        .catch(() => {
          errorMessage.value = 'Unable to load todos';
        });
    });

    return {
      todos,
      title,
      status,
      errorMessage,
      activeTodos,
      completedTodos,
      visibleTodos,
      addTodo,
      updateTodo,
      deleteTodo,
      completedAllTodos,
      deleteCompletedTodos,
    };
  },
};
</script>

<template>
  <div class="todoapp">
    <h1 class="todoapp__title">todos</h1>

    <div class="todoapp__content">
      <header class="todoapp__header">
        <button
          class="todoapp__toggle-all"
          :class="{ active: activeTodos.length !== 0 }"
          @click="completedAllTodos"
        ></button>

        <form @submit.prevent="addTodo">
          <input
            type="text"
            class="todoapp__new-todo"
            placeholder="What needs to be done?"
            v-model="title"
          />
        </form>
      </header>

      <transition-group
        name="list"
        tag="section"
        class="todoapp__main"
      >
        <TodoItem
          v-for="todo in visibleTodos"
          :key="todo.id"
          :todo="todo"
          @update="updateTodo"
          @delete="deleteTodo(todo.id)"
        />
      </transition-group>

      <footer class="todoapp__footer">
        <span class="todoapp__active-count">
          {{ activeTodos.length }} items left
        </span>

        <StatusFilter v-model="status" />

        <button
          v-if="completedTodos.length > 0"
          class="todoapp__clear-completed"
          @click="deleteCompletedTodos"
        >
          Clear completed
        </button>
      </footer>
    </div>

    <Message
      class="is-warning"
      v-if="errorMessage"
    >
      <template #default="{ text }">
        <p>{{ text }}</p>
        <button @click="errorMessage = ''">x</button>
      </template>

      <template #header>
        <p>Server Error</p>
      </template>
    </Message>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
  max-height: 60px;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0);
}
</style>
