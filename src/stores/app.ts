import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, Post, Like, Repost, Bookmark } from '../types/models';

/**
 * Generated Pinia store from APML specification
 * DO NOT EDIT - This file is auto-generated
 */

export const useAppStore = defineStore('app', () => {
  // ========================================
  // State from data models
  // ========================================
  const users = ref<User[]>([]);
  const posts = ref<Post[]>([]);
  const likes = ref<Like[]>([]);
  const reposts = ref<Repost[]>([]);
  const bookmarks = ref<Bookmark[]>([]);

  // ========================================
  // State from logic sections
  // ========================================
  const activeFeedTab = ref<string>("for_you");
  const forYouPosts = ref<Post[]>([]);
  const followingPosts = ref<Post[]>([]);
  const isLoading = ref<boolean>(false);
  const cursor = ref<string>(null);
  const hasMore = ref<boolean>(true);

  // ========================================
  // Computed properties
  // ========================================
  const filteredPosts = computed(() => {
    return activeFeedTab == "forYou" ? forYouPosts : followingPosts;
  });

  const formattedTimestamp = computed(() => {
    return function(created_at) {
      const now = Date.now()
      const diff = now - created_at
      const seconds = diff / 1000
      const minutes = seconds / 60
      const hours = minutes / 60
      const days = hours / 24

      if (seconds < 60) return "now"
      if (minutes < 60) return Math.floor(minutes) + "m"
      if (hours < 24) return Math.floor(hours) + "h"
      if (days < 7) return Math.floor(days) + "d"
      return created_at.toLocaleDateString()
    };
  });

  const postCount = computed(() => {
    return filteredPosts.length;
  });

  // ========================================
  // Actions
  // ========================================

  async function initialLoad() {
    // TODO: Implement initial_load
    // Trigger: {"type":"load"}
  }

  async function loadPostsForTab() {
    // TODO: Implement load_posts_for_tab
    // Trigger: {"type":"custom","condition":"triggered with tab_name"}
  }

  async function loadMorePosts() {
    // TODO: Implement load_more_posts
    // Trigger: {"type":"custom","condition":"triggered"}
  }

  async function refreshFeed() {
    // TODO: Implement refresh_feed
    // Trigger: {"type":"custom","condition":"triggered"}
  }

  async function switchTab() {
    // TODO: Implement switch_tab
    // Trigger: {"type":"custom","condition":"active_feed_tab changes"}
  }

  // Helper functions for data access
  function getUserById(id: string) {
    return users.value.find((item) => item.id === id);
  }

  function getPostById(id: string) {
    return posts.value.find((item) => item.id === id);
  }

  function getLikeById(id: string) {
    return likes.value.find((item) => item.id === id);
  }

  function getRepostById(id: string) {
    return reposts.value.find((item) => item.id === id);
  }

  function getBookmarkById(id: string) {
    return bookmarks.value.find((item) => item.id === id);
  }

  // ========================================
  // Return (Public API)
  // ========================================
  return {
    // Data model state
    users,
    posts,
    likes,
    reposts,
    bookmarks,
    // Logic state
    activeFeedTab,
    forYouPosts,
    followingPosts,
    isLoading,
    cursor,
    hasMore,
    // Computed values
    filteredPosts,
    formattedTimestamp,
    postCount,
    // Actions
    initialLoad,
    loadPostsForTab,
    loadMorePosts,
    refreshFeed,
    switchTab,
    // Helper functions
    getUserById,
    getPostById,
    getLikeById,
    getRepostById,
    getBookmarkById,
  };
});