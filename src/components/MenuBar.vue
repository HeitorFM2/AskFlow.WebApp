<template>
  <div>
    <q-item class="q-pb-sm">
      <div class="questions-menu flex flex-center">
        <q-item-section avatar class="q-pa-md">
          <q-icon color="white" name="chat_bubble_outline" />
        </q-item-section>

        <q-item-section style="color: white" @click="viewPost(op.ID)">
          {{ op.message }}
        </q-item-section>
        <q-btn
          flat
          round
          color="white"
          icon="delete"
          @click="deleteMyPost(op.ID)"
        />
      </div>
    </q-item>
  </div>
  <q-dialog v-model="state.openDialogPost">
    <ViewQuestion
      :postDetail="state.postDetail"
      :userData="userData"
      @closeDialog="state.openDialogPost = false"
    />
  </q-dialog>
</template>

<script>
import ViewQuestion from "./ViewQuestion.vue";
import { defineComponent, reactive, ref } from "vue";
import { getDetailPost, deletePost } from "../service/post";
import { hideLoading, showLoading } from "src/util/plugins";

export default defineComponent({
  name: "MenuBar",
  components: {
    ViewQuestion,
  },

  props: {
    op: {
      type: Object,
    },
    userData: {
      type: Object,
    },
  },
  emits: ["reloadList"],

  setup(props, ctx) {
    const state = reactive({
      postDetail: ref([]),
      openDialogPost: ref(false),
    });

    async function viewPost(idpost) {
      showLoading("Loading...");
      state.postDetail = await getDetailPost(idpost);
      state.openDialogPost = true;
      hideLoading();
    }

    async function deleteMyPost(idpost) {
      showLoading("Loading...");
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
