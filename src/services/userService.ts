import { api } from './api';

// ─────────────────────────────────────────────────
// 📘 أنواع البيانات القادمة من API
// ─────────────────────────────────────────────────
export interface Post {
  id:     number;
  title:  string;
  body:   string;
  userId: number;
}

export interface Todo {
  id:        number;
  title:     string;
  completed: boolean;
  userId:    number;
}

// ─────────────────────────────────────────────────
// 🔧 دوال الـ API
// ─────────────────────────────────────────────────

// جلب كل المنشورات
export const fetchPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>('/posts');
  return response.data;
};

// جلب منشور واحد
export const fetchPostById = async (id: number): Promise<Post> => {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
};

// جلب المهام
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await api.get<Todo[]>('/todos?_limit=10');
  return response.data;
};

// إنشاء منشور جديد
export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const response = await api.post<Post>('/posts', post);
  return response.data;
};