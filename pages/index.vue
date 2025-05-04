<script setup lang="ts">
const { data: posts, error } = await useFetch<{ id: number; text: string; likes_count: number }[]>('https://ezwords_api.takureepers.workers.dev/posts')
async function like(id: number) {
    await useFetch(`https://ezwords_api.takureepers.workers.dev/posts/${id}/like`, {
        method: 'POST',
    })
}
</script>
<template>
    <div class="flex flex-col h-screen">
        <Navbar />
        <div class="mx-auto my-3 w-9/12">
            <TwemojiParse>
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
                <div class="fixed z-50 md:bottom-10 bottom-15 right-10 py-5 px-2  bg-green-400 rounded-full cursor-pointer"
                    onclick="postmodal.showModal()">
                    Post
                </div>
            </TwemojiParse>
        </div>
        <dialog id="postmodal" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Hello!</h3>
                <p class="py-4">Press ESC key or click the button below to close</p>
                <emoji-picker></emoji-picker>
                <div class="modal-action">
                    <form method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
        <Footer />
    </div>
</template>