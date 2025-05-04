<script setup lang="ts">
const { data: posts, error } = await useFetch<{ id: number; text: string; likes_count: number }[]>('https://ezwords_api.takureepers.workers.dev/posts')
async function like(id: number){
    await useFetch(`https://ezwords_api.takureepers.workers.dev/posts/${id}/like`)
}
</script>
<template>
    <div class="flex flex-col h-screen">
        <Navbar />
        <div class="mx-auto my-3 w-9/12">
            <!-- メイン -->
            <div v-if="error" class="alert alert-error">
                エラーが発生しました
            </div>
            <div v-else-if="!posts" class="loading loading-spinner"></div>
            <div v-else class="grid gap-4">
                <div v-for="post in posts" :key="post.id" class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <p class="text-lg">{{ post.text }}</p>
                        <div class="card-actions justify-end">
                            <button class="btn btn-sm btn-outline btn-primary" @click="like(post.id)">
                                ❤️ {{ post.likes_count }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>