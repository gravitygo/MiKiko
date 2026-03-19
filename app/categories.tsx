import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useCategoryStore } from '@/state/category.store';
import { useCategories } from '@/hooks/use-categories';
import type { Category, CategoryType } from '@/modules/category/category.types';

const CATEGORY_ICONS = [
  'restaurant', 'cart', 'car', 'bag', 'game-controller', 'flash', 'medical', 'repeat',
  'wallet', 'briefcase', 'gift', 'swap-horizontal', 'home', 'airplane', 'book', 'game-controller-outline',
  'cafe', 'pizza', 'musical-notes', 'fitness', 'paw', 'people', 'cut', 'construct',
];

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#DDA0DD', '#FFBA00',
  '#05DF72', '#0084D1', '#FF8C42', '#A855F7', '#EC4899',
  '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EF4444',
];

interface CategoryItemProps {
  category: Category;
  onPress: () => void;
}

function CategoryItem({ category, onPress }: CategoryItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center p-4 mb-3 rounded-bento"
      style={{ backgroundColor: colors.surface }}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: category.color + '20' }}
      >
        <Ionicons name={category.icon as any} size={24} color={category.color} />
      </View>
      <View className="flex-1">
        <Text style={{ color: colors.text }} className="text-base font-semibold">
          {category.name}
        </Text>
        <Text style={{ color: colors.textSecondary }} className="text-sm capitalize">
          {category.type}
        </Text>
      </View>
      {category.isDefault && (
        <View className="bg-primary/20 px-2 py-1 rounded-full">
          <Text className="text-primary text-xs font-medium">Default</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<CategoryType>('expense');
  const [selectedIcon, setSelectedIcon] = useState(CATEGORY_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryType>('expense');

  const categories = useCategoryStore((s) => s.categories);
  const { fetch: fetchCategories, add, edit, remove } = useCategories();

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  useEffect(() => {
    fetchCategories().finally(() => setLoading(false));
  }, [fetchCategories]);

  const resetForm = useCallback(() => {
    setName('');
    setSelectedType('expense');
    setSelectedIcon(CATEGORY_ICONS[0]);
    setSelectedColor(COLORS[0]);
    setEditingCategory(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setSelectedType(activeTab);
    setShowModal(true);
  }, [resetForm, activeTab]);

  const handleOpenEdit = useCallback((category: Category) => {
    if (category.isDefault) return; // Don't allow editing default categories

    setEditingCategory(category);
    setName(category.name);
    setSelectedType(category.type);
    setSelectedIcon(category.icon);
    setSelectedColor(category.color);
    setShowModal(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowModal(false);
    resetForm();
  }, [resetForm]);

  const handleSave = useCallback(async () => {
    if (!name.trim()) return;

    setSubmitting(true);

    if (editingCategory) {
      await edit(editingCategory.id, {
        name: name.trim(),
        type: selectedType,
        icon: selectedIcon,
        color: selectedColor,
      });
    } else {
      await add({
        name: name.trim(),
        type: selectedType,
        icon: selectedIcon,
        color: selectedColor,
      });
    }

    setSubmitting(false);
    handleClose();
  }, [name, selectedType, selectedIcon, selectedColor, editingCategory, add, edit, handleClose]);

  const handleDelete = useCallback(async () => {
    if (!editingCategory || editingCategory.isDefault) return;

    setSubmitting(true);
    await remove(editingCategory.id);
    setSubmitting(false);
    handleClose();
  }, [editingCategory, remove, handleClose]);

  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryItem category={item} onPress={() => handleOpenEdit(item)} />
    ),
    [handleOpenEdit]
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Stack.Screen options={{ title: 'Categories', headerShown: true }} />
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: 'Categories',
          headerShown: true,
          headerRight: () => (
            <Pressable onPress={handleOpenCreate} className="mr-2">
              <Ionicons name="add-circle" size={28} color={colors.tint} />
            </Pressable>
          ),
        }}
      />

      {/* Tab Switcher */}
      <View className="flex-row mx-4 mt-4 p-1 rounded-bento" style={{ backgroundColor: colors.surface }}>
        <Pressable
          onPress={() => setActiveTab('expense')}
          className={`flex-1 py-3 rounded-bento-sm items-center ${
            activeTab === 'expense' ? 'bg-expense' : ''
          }`}
        >
          <Text
            className={`font-semibold ${
              activeTab === 'expense' ? 'text-white' : ''
            }`}
            style={activeTab !== 'expense' ? { color: colors.textSecondary } : undefined}
          >
            Expense
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('income')}
          className={`flex-1 py-3 rounded-bento-sm items-center ${
            activeTab === 'income' ? 'bg-income' : ''
          }`}
        >
          <Text
            className={`font-semibold ${
              activeTab === 'income' ? 'text-white' : ''
            }`}
            style={activeTab !== 'income' ? { color: colors.textSecondary } : undefined}
          >
            Income
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredCategories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Ionicons name="grid-outline" size={48} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted }} className="mt-4 text-base">
              No {activeTab} categories yet
            </Text>
            <Pressable
              onPress={handleOpenCreate}
              className="mt-4 bg-primary px-6 py-3 rounded-bento"
            >
              <Text className="text-white font-semibold">Add Category</Text>
            </Pressable>
          </View>
        }
      />

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View style={{ backgroundColor: colors.surface }} className="rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text style={{ color: colors.text }} className="text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </Text>
              <Pressable onPress={handleClose} className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: colors.surfaceHover }}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Name */}
            <Text style={{ color: colors.textSecondary }} className="text-sm mb-2">
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Category name"
              placeholderTextColor={colors.textMuted}
              style={{ backgroundColor: colors.surfaceHover, color: colors.text }}
              className="rounded-xl px-4 py-3 mb-4"
            />

            {/* Type */}
            <Text style={{ color: colors.textSecondary }} className="text-sm mb-2">
              Type
            </Text>
            <View className="flex-row mb-4">
              <Pressable
                onPress={() => setSelectedType('expense')}
                className="flex-1 py-3 rounded-xl mr-2 items-center"
                style={{
                  backgroundColor: selectedType === 'expense' ? '#FF6B6B' : colors.surfaceHover,
                }}
              >
                <Text
                  className="font-semibold"
                  style={{ color: selectedType === 'expense' ? '#FFFFFF' : colors.text }}
                >
                  Expense
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSelectedType('income')}
                className="flex-1 py-3 rounded-xl ml-2 items-center"
                style={{
                  backgroundColor: selectedType === 'income' ? '#05DF72' : colors.surfaceHover,
                }}
              >
                <Text
                  className="font-semibold"
                  style={{ color: selectedType === 'income' ? '#FFFFFF' : colors.text }}
                >
                  Income
                </Text>
              </Pressable>
            </View>

            {/* Icon */}
            <Text style={{ color: colors.textSecondary }} className="text-sm mb-2">
              Icon
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {CATEGORY_ICONS.map((icon) => (
                <Pressable
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  className="w-12 h-12 rounded-xl mr-2 mb-2 items-center justify-center"
                  style={{
                    backgroundColor: selectedIcon === icon ? selectedColor : colors.surfaceHover,
                  }}
                >
                  <Ionicons
                    name={icon as any}
                    size={24}
                    color={selectedIcon === icon ? '#FFFFFF' : colors.text}
                  />
                </Pressable>
              ))}
            </View>

            {/* Color */}
            <Text style={{ color: colors.textSecondary }} className="text-sm mb-2">
              Color
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {COLORS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  className="w-10 h-10 rounded-full mr-2 mb-2 items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  )}
                </Pressable>
              ))}
            </View>

            {/* Actions */}
            <View className="flex-row mt-2">
              {editingCategory && !editingCategory.isDefault && (
                <Pressable
                  onPress={handleDelete}
                  disabled={submitting}
                  className="flex-1 py-4 rounded-xl items-center mr-2"
                  style={{ backgroundColor: '#FF6B6B20' }}
                >
                  <Text style={{ color: '#FF6B6B' }} className="font-semibold">
                    Delete
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={handleSave}
                disabled={submitting || !name.trim()}
                className="flex-1 py-4 rounded-xl items-center"
                style={{
                  backgroundColor: name.trim() ? colors.tint : colors.surfaceHover,
                }}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text
                    className="font-semibold"
                    style={{ color: name.trim() ? '#FFFFFF' : colors.textMuted }}
                  >
                    {editingCategory ? 'Save' : 'Create'}
                  </Text>
                )}
              </Pressable>
            </View>

            <View style={{ height: insets.bottom + 16 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

