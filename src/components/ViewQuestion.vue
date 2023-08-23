<template>
  <div class="view-question q-my-xl q-pa-md bg-primary">
    <div class="flex q-pa-md justify-end">
      <q-btn
        flat
        round
        color="white"
        icon="close"
        @click="$emit('close-dialog')"
      />
    </div>
    <q-card class="q-ma-md q-pa-md" style="background-color: rgb(39, 36, 36)">
      <p class="text-center text-h5 text-weight-medium text-white">Post</p>
      <q-separator />
      <div class="q-pa-md">
        <div class="flex justify-between">
          <q-item class="text-white">
            <q-item-section avatar>
              <q-avatar>
                <q-img src="../assets/imgs/img.jpg" :ratio="1" />
              </q-avatar>
            </q-item-section>

            <q-item-section class="text-subtitle1"
              >{{ postDetail.first_name }}
              {{ postDetail.last_name }}</q-item-section
            >
          </q-item>
        </div>
        <q-input
          v-model="state.messageBody"
          borderless
          :readonly="true"
          color="white"
          type="textarea"
          placeholder="Ask your question..."
          :input-style="{
            resize: 'none',
            height: '140px',
            color: 'white',
          }"
        />
      </div>

      <q-separator />
      <q-card-actions class="flex flex-center">
        <q-btn flat round color="white" icon="add_comment">
          <q-tooltip class="bg-primary" :offset="[10, 10]">
            Add answer
          </q-tooltip></q-btn
        >
      </q-card-actions>
    </q-card>
    <q-card class="bg-secondary q-ma-md q-pa-md q-mt-xl">
      <p
        class="text-center text-h5 text-weight-medium text-white"
        v-show="state.responsePost"
      >
        Answers
      </p>
      <q-separator />
      <q-card
        class="bg-secondary q-pa-md"
        v-for="(q, index) in state.responsePost"
        :key="index"
      >
        <div class="flex justify-between">
          <q-item class="text-white">
            <q-item-section avatar>
              <q-avatar>
                <q-img src="../assets/imgs/img.jpg" :ratio="1" />
              </q-avatar>
            </q-item-section>

            <q-item-section class="text-subtitle1"
              >{{ q.first_name }} {{ q.last_name }}</q-item-section
            >
          </q-item>
        </div>
        <q-input
          v-model="q.message"
          borderless
          color="white"
          type="textarea"
          placeholder="Ask your question..."
          :input-style="{
            resize: 'none',
            height: '120px',
            color: 'white',
          }"
        />
      </q-card>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onBeforeMount } from "vue";
import { getResponsesPost } from "../service/post";
import { showLoading, hideLoading } from "src/util/plugins";

export default defineComponent({
  name: "ViewQuestion",
  props: {
    postDetail: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const state = reactive({
      messageBody: ref(props.postDetail.message),
      responsePost: ref([]),
      messagePost: ref(""),
    });

    onBeforeMount(async () => {
      listResponsesPost();
    });

    async function listResponsesPost() {
      showLoading("Carregando...");
      state.responsePost = [];
      state.responsePost = await getResponsesPost(props.postDetail.ID);
      hideLoading();
    }

    return {
      state,
    };
  },
});
</script>
