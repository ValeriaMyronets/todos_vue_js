import { client } from '../utils/client'

export const getTodos = () => {
  return client.get('/todos?userId=110');
};

export const createTodo = (title) => {
  return client.post('/todos', {
    title,
    completed: false,
    userId: 110,
  });
};

export const updateTodo = ({ id, title, completed }) => {
  return client.patch(`/todos/${id}`, {
    title,
    completed,
  });
};

export const deleteTodo = (todoId) => {
  return client.delete(`/todos/${todoId}`);
};