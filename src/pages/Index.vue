<template>
  <q-page>
    <div class="column flex-center q-pa-md">
      <q-select
        standout
        dense
        v-model="state.search"
        :options="optionsPost"
        option-label="message"
        options-value="ID"
        style="width: 70%"
        bg-color="primary"
        hide-dropdown-icon
        use-input
        @update:model-value="
          (state.postDetail = state.search), (state.openDialogPost = true)
        "
        @filter="filterPost"
        popup-content-style="background-color: rgb(39, 36, 36);"
      >
        <template v-slot:prepend>
          <q-icon name="search" color="white" />
        </template>
        <template v-if="state.search" v-slot:append>
          <q-icon
            name="cancel"
            @click.stop.prevent="state.search = ''"
            class="cursor-pointer"
          />
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label caption class="text-white"
                >{{ scope.opt.first_name }}
                {{ scope.opt.last_name }}</q-item-label
              >
              <q-item-label class="text-white">
                {{ scope.opt.message }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <div class="questions q-mt-xl q-pa-lg">
        <p class="text-center text-h5 text-weight-medium q-pd-md">Feed</p>
        <q-card
          class="q-ma-lg card-questions"
          v-for="(q, index) in state.posts"
          :key="index"
          @click="(state.postDetail = q), (state.openDialogPost = true)"
        >
          <q-card-section>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-img :src="q.img" :ratio="1" />
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
    </div>
    <q-btn
      class="fixed-btn"
      round
      color="accent"
      icon="add"
      size="lg"
      @click="state.openNewPost = true"
    >
      <q-tooltip class="bg-primary" :offset="[10, 10]"> Add post </q-tooltip>
    </q-btn>
  </q-page>

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
    <ViewQuestion
      :postDetail="state.postDetail"
      :userData="userData"
      @close-dialog="state.openDialogPost = false"
    />
  </q-dialog>

  <q-dialog v-model="state.openNewPost">
    <q-card class="send-question bg-secondary q-ma-md q-pa-md">
      <div class="flex justify-between">
        <q-item class="text-white">
          <q-item-section avatar>
            <q-avatar>
              <q-img :src="userData.img" :ratio="1" />
            </q-avatar>
          </q-item-section>

          <q-item-section class="text-subtitle1"
            >{{ userData.first_name }} {{ userData.last_name }}</q-item-section
          >
        </q-item>
      </div>

      <q-input
        v-model="state.messageBody"
        borderless
        color="white"
        type="textarea"
        placeholder="Ask your question..."
        :input-style="{
          resize: 'none',
          height: '220px',
          color: 'white',
        }"
      />
      <p class="text-red text-center" v-if="state.errorBody">Empty message!</p>
      <q-card-actions align="right">
        <q-btn push color="accent" round icon="send" @click="createNewPost()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, ref, onBeforeMount } from "vue";
import { getPosts, createPost } from "../service/post";
import { LocalStorage } from "quasar";
import ViewQuestion from "src/components/ViewQuestion.vue";
import { hideLoading, showLoading, showNegativeNotify } from "src/util/plugins";

export default defineComponent({
  name: "PageIndex",

  components: {
    ViewQuestion,
  },
  props: {
    userData: {
      type: Object,
    },
  },

  emits: ["reloadList"],

  setup(props, ctx) {
    const state = reactive({
      posts: ref([]),
      postDetail: [],
      search: ref(""),
      messageBody: ref(""),
      messageReponse: ref(""),
      openNewPost: ref(false),
      onDialogHide: ref(false),
      openDialogPost: ref(false),
    });

    onBeforeMount(async () => {
      list();
    });

    async function list() {
      showLoading("Loading...");
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

    async function createNewPost() {
      if (state.messageBody == "") {
        state.errorBody = true;
        return;
      }
      showLoading("Loading...");
      try {
        let data = {
          iduser: parseInt(LocalStorage.getItem("iduser")),
          message: state.messageBody,
        };

        await createPost(data);
        list();
        ctx.emit("reloadList");
      } catch (error) {
        console.warn(error);
        showNegativeNotify("Ocorreu um erro!");
      }
      state.openNewPost = false;
      state.messageBody = "";
      hideLoading();
    }

    const optionsPost = ref(state.posts);

    async function filterPost(val, update) {
      if (val === "") {
        update(() => {
          optionsPost.value = state.posts;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        const listPosts = state.posts.map((v) => v);
        optionsPost.value = listPosts.filter((option) => {
          if (String(option.message).toLowerCase().indexOf(needle) > -1) {
            return option;
          }
        });
      });
    }

    return {
      filterPost,
      optionsPost,
      state,
      list,
      createNewPost,
    };
  },
});
</script>
