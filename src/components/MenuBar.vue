<template>
  <div>
    <q-item class="q-pb-sm">
      <div class="flex flex-center questions-menu">
        <q-item-section avatar class="q-pa-md">
          <q-icon color="white" name="chat_bubble_outline" />
        </q-item-section>

        <q-item-section style="color: white" @click="viewPost(op.ID)">
          <q-input
            v-model="state.message.op.message"
            borderless
            :readonly="true"
            color="white"
            :input-style="{
              resize: 'none',
              color: 'white',
            }"
          />
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
      message: ref(""),
      postDetail: ref([]),
      openDialogPost: ref(false),
    });

    state.message = props;

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
