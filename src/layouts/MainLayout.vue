<template>
  <q-layout view="hHh LpR lff">
    <div class="flex justify-between q-pa-md lt-md">
      <q-btn
        color="secondary"
        icon="question_answer"
        @click="state.showQuestions = true"
      />
      <q-btn color="secondary" icon="person" @click="state.showPerfil = true" />
    </div>
    <q-drawer
      v-model="state.showQuestions"
      show-if-above
      :breakpoint="1024"
      class="bg-primary"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item class="flex flex-center text-h6" style="color: white">
            AskFlow
            <q-tooltip class="bg-secondary" :offset="[10, 10]">
              2023© Heitor Melegate V1.0
            </q-tooltip></q-item
          >
          <q-separator />
          <q-item
            class="flex flex-right text-caption q-pt-md"
            style="color: white"
          >
            Your questions
          </q-item>
          <div>
            <MenuBar
              v-for="(op, index) in state.myPosts"
              :op="op"
              :userData="state.userData"
              :key="index"
              @reloadList="list(), reloadList()"
            />
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer
      v-model="state.showPerfil"
      side="right"
      show-if-above
      :breakpoint="1024"
      :width="350"
      class="bg-primary"
    >
      <q-scroll-area class="fit">
        <div class="q-pt-xl flex flex-center">
          <div class="flex items-end">
            <q-img
              :src="state.userData.img"
              class="img-profile"
              :img-style="{
                borderRadius: '50%',
              }"
              :ratio="1"
              @click="openFilePicker"
            >
              <q-tooltip class="bg-secondary" :offset="[10, 10]">
                Click to edit image!
              </q-tooltip>
            </q-img>
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
                Click to edit image email!
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
    </q-drawer>
    <q-page-container>
      <Index
        @reloadList="list()"
        :userData="state.userData"
        ref="indexComponentRef"
      />
    </q-page-container>
  </q-layout>

  <q-dialog v-model="state.onDialogHide">
    <q-card class="bg-primary text-white" style="width: 20%">
      <q-card-section>
        Are you sure you want to log out?
        <q-icon name="sentiment_very_dissatisfied"
      /></q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Fechar"
          color="secondary"
          @click="state.onDialogHide = false"
        />
        <q-btn label="Confirmar" color="secondary" @click="logout()" />
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
          @click="editEmail(state.newEmail)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import MenuBar from "components/MenuBar.vue";
import Index from "src/pages/Index.vue";
import { onBeforeMount } from "vue";
import { getUserPost, getUser, emailEdit, imgEdit } from "../service/post";
import { imgImgur } from "../service/img";
import { defineComponent, ref, reactive } from "vue";
import { hideLoading, showLoading } from "src/util/plugins";
import { LocalStorage } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  components: {
    MenuBar,
    Index,
  },
  methods: {
    reloadList() {
      this.$refs.indexComponentRef.list();
    },
  },
  setup() {
    const state = reactive({
      myPosts: [],
      userData: [],
      postDetail: ref([]),
      onDialogHide: ref(false),
      showQuestions: ref(false),
      showPerfil: ref(false),
      openDialogEdit: ref(false),
      errorBody: ref(false),
      newEmail: ref(""),
      messageBody: ref(""),
      urlImg: ref(""),
    });
    const router = useRouter();
    onBeforeMount(async () => {
      list();
    });

    function openFilePicker() {
      document.getElementById("fileInput").click();
    }

    async function list() {
      showLoading("Loading...");
      try {
        let response = await getUserPost();
        state.myPosts = response.data;

        response = await getUser();
        state.userData = response.data;
      } catch (error) {
        console.warn(error);
      } finally {
        hideLoading();
      }
    }

    async function logout() {
      router.push("/");
      LocalStorage.remove("iduser");
      LocalStorage.remove("token");
    }

    async function editEmail(newEmail) {
      showLoading("Loading...");
      try {
        await emailEdit({ email: newEmail });
        list();
      } catch (error) {
        console.warn(error);
      } finally {
        state.openDialogEdit = false;
        hideLoading();
      }
    }

    async function fileUpload(e) {
      showLoading("Loading...");
      try {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
          return;
        }
        const formdata = new FormData();
        formdata.append("image", selectedFile);
        await imgImgur(formdata).then((response) => {
          state.urlImg = response.link;
        });

        await imgEdit({ img: state.urlImg });

        list();
      } catch (error) {
        console.warn(error);
      } finally {
        hideLoading();
      }
    }

    return {
      state,
      logout,
      list,
      editEmail,
      openFilePicker,
      fileUpload,
    };
  },
});
</script>
