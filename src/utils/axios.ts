import axios from 'axios';

const API_BASE_URL = 'https://api.altan.ai/galaxia/hook/BC3v7z';
const TABLE_ID = 'e2bb58ff-5ba7-4dca-a9c5-b4c288ea94a7';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoApi = {
  async getTodos() {
    const response = await api.post(`/table/${TABLE_ID}/record/query`, {
      amount: 'all',
      sort: [{ field: 'created_at', direction: 'desc' }],
    });
    return response.data.records;
  },

  async createTodo(todo: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
  }) {
    const response = await api.post(`/table/${TABLE_ID}/record`, {
      records: [{
        fields: {
          ...todo,
          completed: false,
          created_at: new Date().toISOString(),
        },
      }],
    });
    return response.data.records[0];
  },

  async updateTodo(id: number, fields: {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
  }) {
    const response = await api.patch(`/table/${TABLE_ID}/record/${id}`, {
      fields,
    });
    return response.data.record;
  },

  async deleteTodo(id: number) {
    await api.delete(`/table/${TABLE_ID}/record/${id}`);
  },
};

export default api;