<script setup lang="ts">
import { ref } from 'vue';
const post_text = ref('');
// const postmodal = document.getElementById('postmodal') as HTMLDialogElement | null;
// import Alert from '@/components/Alert.vue';

// const alertMessage = ref('');
// const alertVisible = ref(false);

const { data: posts, error } = await useFetch<{ id: number; text: string; likes_count: number }[]>('https://ezwords_api.takureepers.workers.dev/posts')
async function like(id: number) {
    await useFetch(`https://ezwords_api.takureepers.workers.dev/posts/${id}/like`, {
        method: 'POST',
    })
}
function extractEmojis(input: string): string {
    // 絵文字にマッチする正規表現（ZWJ絵文字・スキンカラー含む）
    const emojiRegex = /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})(?:\uFE0F|\u200D|\p{Emoji_Modifier})*/gu
    return (input.match(emojiRegex) || []).join('')
}
async function post() {
    const text = post_text.value;
    if (text.trim() == '' || text.length > 200) {
        alert('投稿内容が空か、または200文字を超えています。');
    } else if (extractEmojis(text).length < 1) {
        alert('絵文字を含む投稿をしてください。');
        // return;
    } else {
        try {
            const res = await useFetch("https://ezwords_api.takureepers.workers.dev/posts", {
                method: 'POST',
                body: JSON.stringify(text),
            })
            if (res.error) {
                if (res.error.value) {
                    // messageプロパティがあればそれを、なければJSON文字列を表示
                    const msg = typeof res.error.value === 'object' && 'message' in res.error.value
                        ? res.error.value.message
                        : JSON.stringify(res.error.value);
                    alert('投稿に失敗しました: ' + msg);
                }
            } else {
                alert('投稿が成功しました！');
                post_text.value = ''; // 投稿後にテキストエリアをクリア
            }
        } catch {
            alert('通信エラーが発生しました。');
        }
    }
    closeModal();
    location.reload(); // 投稿後にページをリロードして最新の投稿を表示
    // バグ修正用

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
                <!-- <Alert /> -->
            </TwemojiParse>
        </div>
        <dialog id="postmodal" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">投稿</h3>
                <div class="py-4">
                    <textarea v-model="post_text" class="textarea w-full" placeholder="絵文字でなにか投稿してみよう..."
                        style="resize: none;"></textarea>
                </div>
                <!-- <emoji-picker></emoji-picker> -->
                <div class="modal-action">
                    <div class="join">
                        <button class="btn join-item btn-primary" @click="post();">投稿</button>
                        <button class="btn join-item btn-secondary">プレビュー</button>
                        <form method="dialog">
                            <!-- if there is a button in form, it will close the modal -->
                            <button id="postclose" class="btn join-item">閉じる</button>
                        </form>
                    </div>
                </div>
            </div>
        </dialog>
        <Footer />
    </div>
</template>
<script lang="ts">
function closeModal() {
    const postmodal = document.getElementById('postmodal') as HTMLDialogElement | null;
    if (postmodal) postmodal.close();
}
</script>