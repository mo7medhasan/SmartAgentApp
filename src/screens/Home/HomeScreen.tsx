import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator,
  RefreshControl, TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES } from '@constants/index';
import { useAuthStore } from '@store/index';
import { usePosts, useCreatePost } from '@hooks/usePosts';
import { Post } from '@services/userService';

const HomeScreen = (): React.JSX.Element => {
  const { t }     = useTranslation();
  const user      = useAuthStore(state => state.user);
  const [newTitle, setNewTitle] = useState('');

  // ✅ جلب البيانات مع React Query
  const {
    data:       posts,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = usePosts();

  // ✅ إنشاء منشور جديد
  const { mutate: createPost, isPending: isCreating } = useCreatePost();

  // ── إضافة منشور ───────────────────────────────
  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createPost({
      title:  newTitle,
      body:   'محتوى المنشور الجديد',
      userId: 1,
    });
    setNewTitle('');
  };

  // ── شاشة التحميل ──────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  // ── شاشة الخطأ ────────────────────────────────
  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{t('common.error')}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── عنصر المنشور ──────────────────────────────
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.postBody} numberOfLines={3}>
        {item.body}
      </Text>
      <Text style={styles.postId}>#{item.id}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          👋 {t('home.greeting')}
        </Text>
        <Text style={styles.userName}>{user?.name}</Text>
      </View>

      {/* حقل إضافة منشور */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="أضف منشوراً جديداً..."
          value={newTitle}
          onChangeText={setNewTitle}
          placeholderTextColor={COLORS.gray}
        />
        <TouchableOpacity
          style={[styles.addBtn, isCreating && styles.addBtnDisabled]}
          onPress={handleCreate}
          disabled={isCreating}>
          {isCreating
            ? <ActivityIndicator size="small" color={COLORS.white} />
            : <Text style={styles.addBtnText}>+</Text>
          }
        </TouchableOpacity>
      </View>

      {/* قائمة المنشورات */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        // ✅ Pull to Refresh
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.gray,
    fontSize: FONT_SIZES.md,
  },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.danger,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 48,
  },
  greeting: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    opacity: 0.85,
  },
  userName: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    margin: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: FONT_SIZES.md,
    color: COLORS.black,
    elevation: 1,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 46,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnDisabled: { opacity: 0.6 },
  addBtnText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  list: {
    padding: 12,
    gap: 10,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    elevation: 1,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 6,
  },
  postBody: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    lineHeight: 20,
  },
  postId: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    marginTop: 8,
    textAlign: 'right',
  },
});

export default HomeScreen;