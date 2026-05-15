import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchPosts,
  fetchPostById,
  createPost,
  Post,
} from '@services/userService';

// ─────────────────────────────────────────────────
// 🔑 Query Keys — لمنع تكرار الـ strings
// ─────────────────────────────────────────────────
export const QUERY_KEYS = {
  posts:   ['posts']         as const,
  post:    (id: number) => ['posts', id] as const,
  todos:   ['todos']         as const,
};

// ─────────────────────────────────────────────────
// 📋 Hook: جلب كل المنشورات
// ─────────────────────────────────────────────────
export const usePosts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.posts,
    queryFn:  fetchPosts,
    staleTime: 5 * 60 * 1000, // البيانات صالحة 5 دقائق
    retry:     2,              // إعادة المحاولة مرتين عند الفشل
  });
};

// ─────────────────────────────────────────────────
// 📄 Hook: جلب منشور واحد
// ─────────────────────────────────────────────────
export const usePost = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.post(id),
    queryFn:  () => fetchPostById(id),
    enabled:  !!id, // لا يعمل إذا كان id فارغاً
  });
};

// ─────────────────────────────────────────────────
// ➕ Hook: إنشاء منشور جديد
// ─────────────────────────────────────────────────
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    // بعد النجاح — تحديث القائمة تلقائياً
    onSuccess: (newPost: Post) => {
      // إضافة المنشور الجديد للـ cache مباشرةً
      queryClient.setQueryData<Post[]>(
        QUERY_KEYS.posts,
        (oldPosts = []) => [newPost, ...oldPosts],
      );
    },

    onError: (error) => {
      console.error('فشل إنشاء المنشور:', error);
    },
  });
};