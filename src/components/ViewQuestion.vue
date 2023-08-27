<template>
  <div
    class="view-question q-pa-md bg-primary"
    :style="['height', state.responsePost ? '80%' : '40%']"
  >
    <div class="flex justify-end">
      <q-btn flat round color="white" icon="close" @click="closeDialog" />
    </div>
    <q-card class="q-ma-md q-pa-md" style="background-color: rgb(39, 36, 36)">
      <p class="text-center text-h5 text-weight-medium text-white">Post</p>
      <q-separator />
      <div>
        <div class="flex justify-between">
          <q-item class="text-white">
            <q-item-section avatar>
              <q-avatar>
                <q-img :src="postDetail.img" :ratio="1" />
              </q-avatar>
            </q-item-section>

            <q-item-section class="text-subtitle1">
              {{ postDetail.first_name }}
              {{ postDetail.last_name }}
            </q-item-section>
          </q-item>
        </div>
        <q-input
          v-show="postDetail.message"
          v-model="state.messageBody"
          borderless
          :readonly="true"
          color="white"
          type="textarea"
          :input-style="{
            resize: 'none',
            color: 'white',
          }"
        />
        <q-img v-show="postDetail.imgpost" :src="postDetail.imgpost" />
      </div>

      <q-separator />
      <q-card-actions class="flex flex-center">
        <q-btn
          flat
          round
          color="white"
          icon="add_comment"
          @click="state.openDialogResponse = true"
        >
          <q-tooltip class="bg-primary" :offset="[10, 10]">
            Add answer
          </q-tooltip></q-btn
        >
      </q-card-actions>
    </q-card>
    <q-card
      class="bg-secondary q-ma-md q-pa-md q-mt-xl"
      v-show="state.responsePost"
    >
      <p class="text-center text-h5 text-weight-medium text-white">Answers</p>
      <q-separator />
      <q-intersection
        transition="jump-down"
        v-for="(q, index) in state.responsePost"
        :key="index"
        class="q-pt-md"
      >
        <div class="flex justify-end">
          <q-icon
            v-if="userData.ID == q.iduser"
            name="close"
            color="white"
            class="cursor-pointer"
            @click="deleteResponsePost(q.ID)"
          />
        </div>
        <div class="flex justify-between">
          <q-item class="text-white">
            <q-item-section avatar>
              <q-avatar>
                <q-img :src="q.img" :ratio="1" />
              </q-avatar>
            </q-item-section>

            <q-item-section class="text-caption q-pt-md">
              {{ q.first_name }} {{ q.last_name }}
              <p>{{ formatDate(q.CreatedAt) }}</p>
            </q-item-section>
          </q-item>
        </div>
        <q-input
          v-model="q.message"
          borderless
          color="white"
          class="q-mb-md"
          :readonly="true"
          type="textarea"
          :input-style="{
            resize: 'none',
            height: '80px',
            color: 'white',
          }"
        />
        <q-separator color="primary" style="width: 100%" />
      </q-intersection>
    </q-card>
  </div>

  <q-dialog v-model="state.openDialogResponse">
    <q-card
      class="bg-primary q-pa-md q-ma-lg"
      style="
        box-shadow: rgba(39, 36, 36) 5px 10px 10px;
        border-radius: 10px;
        width: 50%;
      "
    >
      <q-card-section>
        <div class="flex justify-between">
          <q-item class="text-white">
            <q-item-section avatar>
              <q-avatar>
                <q-img :src="userData.img" :ratio="1" />
              </q-avatar>
            </q-item-section>

            <q-item-section class="text-subtitle1"
              >{{ userData.first_name }}
              {{ userData.last_name }}</q-item-section
            >
          </q-item>
        </div>
        <q-input
          v-model="state.responseBody"
          borderless
          color="white"
          type="textarea"
          maxlength="300"
          :input-style="{
            resize: 'none',
            color: 'white',
          }"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Fechar"
          color="secondary"
          @click="state.openDialogResponse = false"
        />
        <q-btn
          label="Confirmar"
          color="secondary"
          @click="sendResponse(state.responseBody, userData.ID, postDetail.ID)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, ref, onBeforeMount } from "vue";
import {
  getResponsesPost,
  createResponse,
  deleteResponse,
} from "../service/post";
import { showLoading, hideLoading } from "src/util/plugins";
import { formatDate } from "src/util/date";

export default defineComponent({
  name: "ViewQuestion",
  emits: ["closeDialog"],
  props: {
    postDetail: {
      type: Object,
      default: null,
    },
    userData: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const state = reactive({
      messageBody: ref(props.postDetail.message),
      responseBody: ref(""),
      responsePost: ref([]),
      messagePost: ref(""),
      openDialogResponse: ref(false),
    });

    onBeforeMount(async () => {
      listResponsesPost();
    });

    async function listResponsesPost() {
      showLoading("Loading...");
      state.responsePost = [];
      state.responsePost = await getResponsesPost(props.postDetail.ID);
      hideLoading();
    }

    async function sendResponse(message, iduser, idquestion) {
      let data = {
        idquestion: idquestion,
        iduser: iduser,
        message: message,
      };
      showLoading("Loading...");
      try {
        await createResponse(data);
        listResponsesPost();
        state.responseBody = "";
      } catch (error) {
        console.warn(error);
      } finally {
        state.openDialogResponse = false;
        hideLoading();
      }
    }

    async function deleteResponsePost(idresponse) {
      showLoading("Loading...");
      try {
        await deleteResponse(idresponse);
        listResponsesPost();
      } catch (error) {
        console.warn(error);
      } finally {
        hideLoading();
      }
    }

    function closeDialog() {
      ctx.emit("closeDialog");
    }
    return {
      state,
      deleteResponsePost,
      sendResponse,
      closeDialog,
      formatDate,
    };
  },
});
</script>
