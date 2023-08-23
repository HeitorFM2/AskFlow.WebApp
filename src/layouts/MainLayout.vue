<template>
  <q-layout view="hHh LpR lff">
    <div class="flex justify-between">
      <div class="q-pa-md">
        <q-btn
          style="background-color: rgba(39, 36, 36, 0.7)"
          text-color="white"
          icon="chat_bubble_outline"
          @click="leftDrawerOpen = true"
        />
      </div>
      <div class="q-pa-md">
        <q-btn
          style="background-color: rgba(39, 36, 36, 0.7)"
          text-color="white"
          icon="person"
          @click="rightDrawerOpen = true"
        />
      </div>
    </div>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :breakpoint="600"
      class="bg-primary"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item class="flex flex-center text-h6" style="color: white"
            >AskFlow
            <q-tooltip class="bg-secondary" :offset="[10, 10]">
              2023© Heitor Melegate
            </q-tooltip></q-item
          >
          <q-separator />
          <q-item
            class="flex flex-right text-caption q-pt-md"
            style="color: white"
            >Your questions</q-item
          >
          <div>
            <MenuBar
              v-for="(op, index) in state.myPosts"
              :message="op.message"
              :key="index"
              :id="op.ID"
              @reloadList="() => list()"
            />
          </div>
        </q-list>
      </q-scroll-area>
      <div class="q-mini-drawer-hide absolute" style="top: 70px; right: -15px">
        <q-btn
          dense
          round
          unelevated
          color="accent"
          icon="chevron_left"
          @click="leftDrawerOpen = false"
        />
      </div>
      <q-btn
        color="accent"
        icon="post_add"
        label="Post"
        class="fixed-bottom"
        @click="state.openNewPost = true"
      />
    </q-drawer>

    <q-drawer
      side="right"
      v-model="rightDrawerOpen"
      show-if-above
      :breakpoint="1300"
      :width="350"
      style="background-color: #272424"
    >
      <q-scroll-area class="fit">
        <div class="q-pt-xl flex flex-center">
          <div class="flex items-end">
            <q-img
              src="../assets/imgs/img.jpg"
              style="width: 300px"
              :img-style="{
                borderRadius: '50%',
              }"
              :ratio="1"
              @click="openFilePicker"
            />
            <input
              type="file"
              id="fileInput"
              style="display: none"
              @change="fileUpload"
            />
          </div>
          <p class="q-pa-md text-h5 text-white">
            {{ state.userData.first_name }} {{ state.userData.last_name }}
          </p>
          <q-item class="q-pb-md text-white" style="width: 80%">
            <div
              class="options-account flex text-center q-pa-md"
              @click="state.openDialogEdit = true"
            >
              <q-item-section> {{ state.userData.email }} </q-item-section>
              <q-tooltip class="bg-secondary" :offset="[10, 10]">
                Clique para editar!
              </q-tooltip>
            </div>
          </q-item>

          <q-btn
            flat
            color="primary"
            class="fixed-bottom"
            label="Logout"
            text-color="red"
            @click="state.onDialogHide = true"
          />
        </div>
      </q-scroll-area>
      <div class="q-mini-drawer-hide absolute" style="top: 70px; left: -20px">
        <q-btn
          dense
          round
          unelevated
          color="accent"
          icon="chevron_right"
          @click="rightDrawerOpen = false"
        />
      </div>
    </q-drawer>
    <q-dialog v-model="state.onDialogHide">
      <q-card class="bg-primary text-white">
        <q-card-section> Are you sure you want to log out? </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Fechar"
            color="secondary"
            @click="state.onDialogHide = false"
          />
          <q-btn
            label="Confirmar"
            color="secondary"
            @click="$router.push('/')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="state.openDialogEdit">
      <q-card class="bg-primary text-white" style="width: 50%">
        <q-card-section>
          <q-input
            standout="bg-primary"
            v-model="state.userData.email"
            label="Your email"
            :readonly="true"
            :input-style="{ color: 'white' }"
            class="q-ma-md"
            bg-color="secondary"
          />
          <q-input
            standout="bg-primary"
            v-model="state.newEmail"
            placeholder="New email"
            color="white"
            :input-style="{ color: 'white' }"
            class="q-ma-md text-white"
            bg-color="secondary"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Fechar"
            color="secondary"
            @click="state.openDialogEdit = false"
          />
          <q-btn
            label="Confirmar"
            color="secondary"
            @click="$router.push('/')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="state.openNewPost">
      <q-card class="send-question bg-secondary q-ma-md q-pa-md">
        <div class="flex justify-between">
          <q-item class="text-white">
            <q-item-section avatar>
              <q-avatar>
                <q-img src="../assets/imgs/img.jpg" :ratio="1" />
              </q-avatar>
            </q-item-section>

            <q-item-section class="text-subtitle1"
              >{{ state.userData.first_name }}
              {{ state.userData.last_name }}</q-item-section
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
        <p class="text-red text-center" v-if="state.errorBody">
          Empty message!
        </p>
        <q-card-actions align="right">
          <q-btn
            push
            color="accent"
            round
            icon="send"
            @click="createNewPost()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <Index />
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuBar from "components/MenuBar.vue";
import { onBeforeMount, watch } from "vue";
import { getUserPost, getUser, createPost } from "../service/post";
import Index from "src/pages/Index.vue";
import { defineComponent, ref, reactive } from "vue";
import { hideLoading, showLoading, showNegativeNotify } from "src/util/plugins";
import { LocalStorage } from "quasar";

export default defineComponent({
  name: "MainLayout",

  components: {
    MenuBar,
    Index,
  },

  setup() {
    const state = reactive({
      myPosts: [],
      userData: [],
      postDetail: ref([]),
      onDialogHide: ref(false),
      openDialogEdit: ref(false),
      openNewPost: ref(false),
      errorBody: ref(false),
      newEmail: ref(""),
      messageBody: ref(""),
    });

    onBeforeMount(async () => {
      list();
    });

    function openFilePicker() {
      document.getElementById("fileInput").click();
    }

    function fileUpload(e) {
      const selectedFile = e.target.files[0];

      if (!selectedFile) {
        return;
      }
    }

    async function list() {
      let response = await getUserPost();
      state.myPosts = response.data;

      response = await getUser();
      state.userData = response.data;
    }

    async function createNewPost() {
      if (state.messageBody == "") {
        state.errorBody = true;
        return;
      }
      showLoading("Carregando...");
      try {
        let data = {
          iduser: parseInt(LocalStorage.getItem("iduser")),
          message: state.messageBody,
        };

        await createPost(data);
        list();
      } catch (error) {
        console.warn(error);
        showNegativeNotify("Ocorreu um erro!");
      }
      state.openNewPost = false;
      hideLoading();
    }

    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);

    return {
      state,
      list,
      openFilePicker,
      fileUpload,
      createNewPost,
      leftDrawerOpen,
      rightDrawerOpen,
    };
  },
});
</script>
