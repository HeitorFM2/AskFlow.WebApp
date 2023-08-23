<template>
  <q-page>
    <div class="column flex-center">
      <q-input
        rounded
        standout
        v-model="state.search"
        placeholder="Search"
        color="white"
        style="width: 70%"
        bg-color="primary"
        :input-style="{ color: 'white' }"
      >
        <template v-slot:prepend>
          <q-icon name="search" color="white" />
        </template>
        <template v-slot:append v-if="state.search != ''">
          <q-icon
            name="close"
            @click="state.search = ''"
            class="cursor-pointer"
          />
        </template>
      </q-input>

      <div class="questions q-mt-xl q-pa-lg">
        <p class="text-center text-h5 text-weight-medium q-pd-md">Feed</p>
        <q-card
          class="bg-secondary q-ma-lg card-questions"
          v-for="(q, index) in state.posts"
          :key="index"
          @click="(state.postDetail = q), (state.openDialogPost = true)"
        >
          <q-card-section>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-img src="../assets/imgs/img.jpg" :ratio="1" />
                </q-avatar>
              </q-item-section>
              <q-item-section
                >{{ q.first_name }} {{ q.last_name }}</q-item-section
              >
            </q-item>
          </q-card-section>
          <q-card-section>
            {{ q.message }}
            <div class="text-caption q-pt-md">Answers: {{ q.response }}</div>
          </q-card-section>
          <q-tooltip class="bg-primary" :offset="[10, 10]">
            Click to see the answers to this post
          </q-tooltip>
        </q-card>
      </div>
      <q-btn
        class="bottom-right-btn"
        round
        color="primary"
        icon="shopping_cart"
      />
    </div>
    <q-dialog v-model="state.onDialogHide">
      <q-card class="bg-primary text-white dialog-response">
        <q-card-section>
          <div class="text-h6 text-center">Your answer</div>
          <q-input
            v-model="state.messageReponse"
            borderless
            color="white"
            type="textarea"
            placeholder="Make your answer.."
            :input-style="{
              resize: 'none',
              height: '220px',
              color: 'white',
            }"
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            label="Close"
            color="secondary"
            @click="state.onDialogHide = false"
          />
          <q-btn label="Confirm" color="secondary" @click="sendResponse()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="state.openDialogPost">
      <view-question
        :postDetail="state.postDetail"
        @close-dialog="state.openDialogPost = false"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, reactive, ref, onBeforeMount } from "vue";
import { getPosts, createResponse } from "../service/post";
import { LocalStorage } from "quasar";
import ViewQuestion from "src/components/ViewQuestion.vue";
import { hideLoading, showLoading, showNegativeNotify } from "src/util/plugins";

export default defineComponent({
  name: "PageIndex",

  components: {
    ViewQuestion,
  },

  setup() {
    const state = reactive({
      posts: ref([]),
      postDetail: [],
      search: ref(""),
      messageBody: ref(""),
      messageReponse: ref(""),
      onDialogHide: ref(false),
      openDialogPost: ref(false),
    });

    onBeforeMount(async () => {
      list();
    });

    async function list() {
      showLoading("Carregando...");
      state.posts = [];
      try {
        let response = await getPosts();
        state.posts = response.data;
        hideLoading();
      } catch (error) {
        console.warn(error);
        showNegativeNotify("Ocorreu um erro!");
      }
    }

    async function sendQuestion() {
      showLoading("Carregando...");
      try {
        let data = {
          message: state.messageBody,
          iduser: parseInt(LocalStorage.getItem("iduser")),
        };

        await createResponse(data);
        list();
      } catch (error) {
        console.warn(error);
        showNegativeNotify("Ocorreu um erro!");
      }
      hideLoading();
    }

    async function sendResponse() {
      showLoading("Carregando...");
      try {
        let data = {
          message: state.messageBody,
          iduser: state.postDetail.iduser,
          idquestion: state.postDetail.ID,
        };
        await createResponse(data);
        list();

        this.$emit("reload-list");
        state.onDialogHide = false;
      } catch (error) {
        console.warn(error);
        showNegativeNotify("Ocorreu um erro!");
      }
      hideLoading();
    }

    return {
      state,
      sendQuestion,
      sendResponse,
    };
  },
});
</script>
