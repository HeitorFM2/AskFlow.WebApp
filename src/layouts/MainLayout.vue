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
              2023© Heitor Melegate V1.0.1
            </q-tooltip>
          </q-item>

          <q-separator />
          <q-item
            class="flex justify-between text-caption q-pt-md items-center text-center"
            style="color: white"
          >
            Your questions
            <q-btn
              flat
              class="lt-md"
              color="white"
              icon="close"
              @click="state.showQuestions = false"
            />
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
        <q-btn
          flat
          class="lt-md q-pa-md"
          color="white"
          icon="close"
          @click="state.showPerfil = false"
        />
        <div class="flex justify-end q-mt-xl q-pa-md">
          <q-btn-dropdown
            flat
            color="white"
            dense
            rounded
            dropdown-icon="more_vert"
            content-class="bg-primary text-white"
          >
            <q-list class="text-center">
              <q-item
                clickable
                dense
                v-close-popup
                @click="state.onDialogHide = true"
              >
                <q-item-section>
                  <q-item-label class="text-red"> Logout </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                dense
                v-close-popup
                @click="state.openSendEmail = true"
              >
                <q-item-section>
                  <q-item-label>Contact us</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="flex flex-center">
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
            accept="image/*"
            style="display: none"
            @change="fileUpload"
          />
          <p
            class="q-pa-md text-h5 text-white cursor-pointer"
            @click="state.editUsername = true"
          >
            {{ state.userData.first_name }} {{ state.userData.last_name }}
            <q-tooltip class="bg-secondary" :offset="[10, 10]">
              Click to edit username!
            </q-tooltip>
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
    <q-card class="bg-primary text-white" style="width: 20%; min-width: 200px">
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
    <q-card class="bg-primary text-white" style="width: 50%; min-width: 250px">
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
          maxlength="120"
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

  <q-dialog v-model="state.editUsername">
    <q-card class="bg-primary text-white" style="width: 50%; min-width: 250px">
      <q-card-section>
        <q-input
          standout="bg-primary"
          v-model="state.firstName"
          placeholder="First name"
          maxlength="120"
          color="white"
          :input-style="{ color: 'white' }"
          class="q-ma-md"
          bg-color="secondary"
        />
        <q-input
          standout="bg-primary"
          v-model="state.lastName"
          placeholder="Last name"
          maxlength="120"
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
          @click="state.editUsername = false"
        />
        <q-btn
          label="Confirmar"
          color="secondary"
          @click="editUsername(state.firstName, state.lastName)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="state.openSendEmail" @hide="state.alert = false">
    <q-card class="bg-primary text-white" style="width: 50%; min-width: 250px">
      <p class="text-center q-pt-lg text-h6">Contact us</p>
      <q-form @submit="sendEmail()">
        <q-card-section>
          <q-input
            standout="bg-primary"
            v-model="state.nameEmail"
            placeholder="Name"
            color="white"
            maxlength="120"
            :input-style="{ color: 'white' }"
            class="q-ma-md"
            bg-color="secondary"
          />
          <q-input
            standout="bg-primary"
            v-model="state.email"
            placeholder="Email"
            color="white"
            maxlength="120"
            :input-style="{ color: 'white' }"
            class="q-ma-md text-white"
            bg-color="secondary"
          />
          <q-input
            standout="bg-primary"
            v-model="state.messageEmail"
            class="q-ma-md"
            type="textarea"
            maxlength="600"
            bg-color="secondary"
            placeholder="Your message"
            :input-style="{
              resize: 'none',
              color: 'white',
            }"
          />
          <p v-show="state.errorBody" class="text-red text-center">
            Preencha todos os campos!
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Fechar"
            color="secondary"
            @click="state.openSendEmail = false"
          />
          <q-btn label="Confirmar" type="submit" color="secondary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

import MenuBar from "components/MenuBar.vue";
import Index from "src/pages/Index.vue";
import { getUserPost, getUser, imgEdit, usernameEdit } from "../service/post";
import { emailSend, emailEdit } from "../service/email";
import { hideLoading, showLoading } from "src/util/plugins";
import { logout } from "src/util/auth";

import { LocalStorage } from "quasar";

import MenuBar from "components/MenuBar.vue";
import Index from "src/pages/Index.vue";

import { getUserPost, getUser, imgEdit, usernameEdit } from "../service/post";

import { emailSend, emailEdit } from "../service/email";

import { hideLoading, showLoading } from "src/util/plugins";

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
      postDetail: ref([]),

      userData: [],
      firstName: ref(""),
      lastName: ref(""),

      newEmail: ref(""),
      email: ref(""),
      nameEmail: ref(""),
      messageBody: ref(""),
      messageEmail: ref(""),

      urlImg: ref(""),

      onDialogHide: ref(false),
      showQuestions: ref(false),
      showPerfil: ref(false),
      openDialogEdit: ref(false),
      openSendEmail: ref(false),
      editUsername: ref(false),

      errorBody: ref(false),
    });
    const router = useRouter();

    onBeforeMount(async () => {
      if (!LocalStorage.getItem("token")) {
        router.push("/");
        return;
      }
      list();
      listUser();
    });

    function openFilePicker() {
      document.getElementById("fileInput").click();
    }

    async function listUser() {
      let response = await getUser();
      state.userData = response.data;

      state.firstName = state.userData.first_name;
      state.lastName = state.userData.last_name;
    }

    async function list() {
      showLoading("Loading...");
      try {
        let response = await getUserPost();
        response.data.forEach((item) => {
          if (item.message === "") {
            item.message = "Image";
          }
        });
        state.myPosts = response.data;
      } catch (error) {
        console.warn(error);
      } finally {
        hideLoading();
      }
    }

    async function editEmail(newEmail) {
      showLoading("Loading...");
      try {
        await emailEdit({ email: newEmail });
        listUser();
      } catch (error) {
        console.warn(error);
      } finally {
        state.openDialogEdit = false;
        hideLoading();
      }
    }

    async function sendEmail() {
      try {
        const { email, nameEmail, messageEmail } = state;

        if (!email || !nameEmail || !messageEmail) {
          state.errorBody = true;
          return;
        }
        showLoading("Loading...");
        let data = {
          email: email,
          name: nameEmail,
          message: messageEmail,
        };
        await emailSend(data);
      } catch (error) {
        console.warn(error);
      } finally {
        state.openDialogEdit = false;
        hideLoading();
      }
    }

    async function editUsername(firstName, lastName) {
      showLoading("Loading...");
      try {
        await usernameEdit({ first_name: firstName, last_name: lastName });
        listUser();
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

        await imgEdit(formdata);

        listUser();
      } catch (error) {
        console.warn(error);
      } finally {
        hideLoading();
      }
    }

    async function sendEmail() {
      const { email, nameEmail, messageEmail } = state;
      if (!email || !nameEmail || !messageEmail) {
        state.alert = true;
        return;
      }
      showLoading("Sending email...");
      let data = {
        name: state.nameEmail,
        email: state.email,
        message: state.messageEmail,
      };
      try {
        await emailSend(data);
      } catch (error) {
        console.warn(error);
      }
      state.openSendEmail = false;
      hideLoading();
    }

    return {
      state,
      logout,
      list,
      editEmail,
      sendEmail,
      editUsername,
      openFilePicker,
      fileUpload,
    };
  },
});
</script>
