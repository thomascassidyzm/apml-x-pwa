<template>
  <div class="feed-view">
    <header class="header">
      <div class="tab-selector">
        <button class="tab" :class="{ active: activeFeedTab === 'forYou' }" @click="store.activeFeedTab = 'forYou'">
          For You
        </button>
        <button class="tab" :class="{ active: activeFeedTab === 'following' }" @click="store.activeFeedTab = 'following'">
          Following
        </button>
      </div>
    </header>
    <main class="main-feed">
      <div v-if="isLoading && postCount == 0">
        <div class="loading-spinner">
          {{ "Loading posts..." }}
        </div>
      </div>
      <div v-if="!isLoading && postCount == 0">
        <div class="empty-state" data-icon="timeline">
          No posts to show
        </div>
      </div>
      <div v-if="postCount > 0">
        <div class="post-feed virtualized-list">
          <div v-for="post in filteredPosts" :key="post.id" class="list-item">
            <div class="card">
              <section class="author-section">
                <div class="avatar" :src="getUserById(post.author_id)?.avatar_url">
                </div>
                <div class="author-info">
                  <div class="display-name">
                    {{ getUserById(post.author_id)?.display_name }}
                    <div v-if="getUserById(post.author_id)?.verified">
                      <div class="verified-badge" data-icon="verified">
                      </div>
                    </div>
                  </div>
                  <div class="username">
                    {{ "@" + getUserById(post.author_id)?.username }}
                  </div>
                </div>
              </section>
              <section class="content-section">
                <div class="post-text">
                  {{ post.content }}
                </div>
              </section>
              <section class="timestamp-section">
                <div class="timestamp">
                  {{ store.formattedTimestamp(post.created_at) }}
                </div>
              </section>
              <section class="actions-section">
                <button class="reply-button" data-icon="chat_bubble_outline">
                  {{ post.replies_count > 0 ? post.replies_count : "" }}
                </button>
                <button class="repost-button" data-icon="repeat">
                  {{ post.reposts_count > 0 ? post.reposts_count : "" }}
                </button>
                <button class="like-button" :data-icon="post.is_liked ? 'favorite' : 'favorite_border'" :class="{ 'text-red': post.is_liked }">
                  {{ post.likes_count > 0 ? post.likes_count : "" }}
                </button>
                <button class="share-button" data-icon="ios_share">
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
    <nav class="bottom-nav">
      <button class="nav-item" data-icon="home" :class="{ active: true }">
      </button>
      <button class="nav-item" data-icon="search" :class="{ active: false }">
      </button>
      <button class="nav-item" data-icon="notifications" :class="{ active: false }">
      </button>
      <button class="nav-item" data-icon="mail" :class="{ active: false }">
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

// Computed properties from store
const filteredPosts = computed(() => store.filteredPosts);
const postCount = computed(() => store.postCount);

// Helper functions
const getUserById = store.getUserById;
</script>

<style scoped>
/* Component uses global styles */
</style>