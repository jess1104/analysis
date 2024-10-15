<!-- src/components/PostList.vue -->
<template>
  <v-container>
    {{ name }}
    <!-- <div>{{ posts }}</div> -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Posts from API</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="post in posts" :key="post.id">
                <v-list-item-content>
                  <v-list-item-title
                    ><h2>{{ post.title }}</h2></v-list-item-title
                  >
                  <v-list-item-subtitle>{{ post.body }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useDataStore } from "../stores/useDataStore";

const store = useDataStore();

onMounted(async () => {
  await store.fetchPosts();
});

// const ChildOfRefMsg = ref("我是ChildOfRefMsg");
const posts = computed(() => store.posts);
const name = computed(() => store.name);
console.log("posts", posts);
</script>
