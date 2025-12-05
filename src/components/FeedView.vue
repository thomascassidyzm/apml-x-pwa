<template>
  <div class="feed-view">
    <header class="header">
      <div class="tabs">
        <button class="tab" :class="{ active: activeFeedTab === 'forYou' }" @click="store.activeFeedTab = 'forYou'">
          For You
        </button>
        <button class="tab" :class="{ active: activeFeedTab === 'following' }" @click="store.activeFeedTab = 'following'">
          Following
        </button>
      </div>
    </header>

    <main>
      <div v-if="isLoading && postCount === 0" class="loading">
        Loading posts...
      </div>

      <ul v-if="postCount > 0" class="posts">
        <li v-for="post in filteredPosts" :key="post.id" class="post-card">
          <div class="post-header">
            <div class="avatar">
              <img :src="getAuthorAvatar(post.author_id)" :alt="getAuthorName(post.author_id)" />
            </div>
            <div class="post-author">
              <div class="author-info">
                <span class="author-name">{{ getAuthorName(post.author_id) }}</span>
                <svg v-if="getAuthorVerified(post.author_id)" class="verified-badge" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#1d9bf0" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.07 4.89l-3.72-3.72 1.41-1.41 2.31 2.3 4.89-4.88 1.41 1.41-6.3 6.3z"/>
                </svg>
                <span class="author-handle">@{{ getAuthorUsername(post.author_id) }}</span>
                <span class="post-time">{{ store.formattedTimestamp(post.created_at) }}</span>
              </div>
            </div>
          </div>

          <div class="post-content">{{ post.content }}</div>

          <div class="post-actions">
            <button class="action-btn reply">
              <svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>
              <span v-if="post.replies_count">{{ formatCount(post.replies_count) }}</span>
            </button>
            <button class="action-btn repost">
              <svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>
              <span v-if="post.reposts_count">{{ formatCount(post.reposts_count) }}</span>
            </button>
            <button class="action-btn like" :class="{ liked: post.is_liked }">
              <svg viewBox="0 0 24 24"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>
              <span v-if="post.likes_count">{{ formatCount(post.likes_count) }}</span>
            </button>
            <button class="action-btn share">
              <svg viewBox="0 0 24 24"><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></svg>
            </button>
          </div>
        </li>
      </ul>
    </main>

    <nav class="bottom-nav">
      <button class="nav-btn active">
        <svg viewBox="0 0 24 24"><path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"/></svg>
      </button>
      <button class="nav-btn">
        <svg viewBox="0 0 24 24"><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/></svg>
      </button>
      <button class="nav-btn">
        <svg viewBox="0 0 24 24"><path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"/></svg>
      </button>
      <button class="nav-btn">
        <svg viewBox="0 0 24 24"><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"/></svg>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '../stores/app';

const store = useAppStore();

// State from store
const activeFeedTab = computed(() => store.activeFeedTab);
const isLoading = computed(() => store.isLoading);
const filteredPosts = computed(() => store.filteredPosts);
const postCount = computed(() => store.postCount);

// Helper functions
const getAuthorName = (id: string) => store.getUserById(id)?.display_name || 'Unknown';
const getAuthorUsername = (id: string) => store.getUserById(id)?.username || 'unknown';
const getAuthorAvatar = (id: string) => store.getUserById(id)?.avatar_url || '';
const getAuthorVerified = (id: string) => store.getUserById(id)?.verified || false;

// Format large numbers (42000 -> 42K)
const formatCount = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return count.toString();
};
</script>

<style scoped>
/* Component uses global styles from style.css */
.action-btn.like.liked {
  color: #f91880;
}
.action-btn.like.liked svg {
  fill: #f91880;
}
</style>
