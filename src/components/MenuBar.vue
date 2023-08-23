<template>
  <div>
    <q-item class="q-pb-sm">
      <div class="questions-menu flex flex-center">
        <q-item-section avatar class="q-pa-md">
          <q-icon color="white" name="chat_bubble_outline" />
        </q-item-section>

        <q-item-section style="color: white" @click="viewPost(id)">
          {{ message }}
        </q-item-section>
        <q-btn
          flat
          round
          color="white"
          icon="delete"
          @click="deleteMyPost(id)"
        />
      </div>
    </q-item>
  </div>
  <q-dialog v-model="state.openDialogPost">
    <ViewQuestion
      :postDetail="state.postDetail"
      @close-dialog="state.openDialogPost = false"
    />
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import ViewQuestion from "./ViewQuestion.vue";
import { getDetailPost, deletePost } from "../service/post";
import { hideLoading, showLoading, showNegativeNotify } from "src/util/plugins";

export default defineComponent({
  name: "MenuBar",
  components: {
    ViewQuestion,
  },

  props: {
    message: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
    },
  },
  emits: ["reloadList"],

  setup(props, ctx) {
    const state = reactive({
      postDetail: ref([]),
      openDialogPost: ref(false),
    });

    async function viewPost(idpost) {
      showLoading("Carregando...");
      state.postDetail = await getDetailPost(idpost);
      state.openDialogPost = true;
      hideLoading();
    }

    async function deleteMyPost(idpost) {
      showLoading("Carregando...");
      await deletePost(idpost);
      ctx.emit("reloadList");
      hideLoading();
    }

    return {
      state,
      viewPost,
      deleteMyPost,
    };
  },
});
</script>
