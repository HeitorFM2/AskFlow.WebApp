<template>
  <q-layout view="hHh LpR lff" class="flex column items-center flex-center">
    <p class="text-white text-h3 q-pa-sm">AskFlow</p>
    <div
      class="q-pa-md login-card q-pa-md flex column justify-center items-center"
    >
      <div class="text-white text-subtitle1 q-pa-lg" v-show="!state.pageLogin">
        Already have an account?
        <span
          class="text-accent cursor-pointer"
          @click="state.pageLogin = true"
        >
          Login
        </span>
      </div>
      <div class="text-white text-subtitle1 q-pa-lg" v-show="state.pageLogin">
        Don't have an account?
        <span
          class="text-accent cursor-pointer"
          @click="state.pageLogin = false"
        >
          Sign up
        </span>
      </div>
      <q-input
        v-show="!state.pageLogin"
        rounded
        standout
        v-model="state.first_name"
        class="q-pa-md"
        placeholder="First name"
        bg-color="primary"
        :input-style="{ color: 'white' }"
      />
      <q-input
        v-show="!state.pageLogin"
        rounded
        standout
        v-model="state.last_name"
        class="q-pa-md"
        placeholder="Last name"
        color="white"
        bg-color="primary"
        :input-style="{ color: 'white' }"
      />
      <q-input
        rounded
        standout
        v-model="state.email"
        class="q-pa-md"
        placeholder="Email"
        color="white"
        type="email"
        bg-color="primary"
        :input-style="{ color: 'white' }"
      />

      <q-input
        rounded
        standout
        v-model="state.pass"
        class="q-pa-md inputs-login"
        placeholder="Password"
        :type="state.showPassword ? 'text' : 'password'"
        color="white"
        bg-color="primary"
        :input-style="{ color: 'white' }"
      >
        <template v-slot:append>
          <q-icon
            :name="state.showPassword ? 'visibility_off' : 'visibility'"
            @click="() => (state.showPassword = !state.showPassword)"
            class="cursor-pointer"
          />
        </template>
      </q-input>

      <p v-show="state.alert" class="text-red">Preencha todos os campos!</p>
      <q-btn
        color="accent"
        style="width: 45%"
        size="md"
        class="q-pa-md q-mt-lg"
        :label="state.pageLogin ? 'Login' : 'Register'"
        @click="LoginRegister()"
      />
    </div>
  </q-layout>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { Login, Register } from "../service/login";
import { LocalStorage } from "quasar";
import { showLoading, hideLoading } from "../util/plugins";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",

  setup() {
    const state = reactive({
      first_name: ref(""),
      last_name: ref(""),
      email: ref(""),
      pass: ref(""),
      pageLogin: ref(true),
      alert: ref(false),
      showPassword: ref(false),
      userData: [],
    });

    const router = useRouter();
    async function LoginRegister() {
      showLoading("Carregando");
      let data = {
        first_name: state.first_name,
        last_name: state.last_name,
        email: state.email,
        password: state.pass,
      };
      try {
        const { email, pass, first_name, last_name } = state;
        if (state.pageLogin) {
          if (!email || !pass) {
            state.alert = true;
            return;
          }
          state.userData = await Login(data);
          state.userData.success ? router.push("/home") : "";

          LocalStorage.set("iduser", state.userData.data.ID);
        } else {
          if (!email || !pass || !first_name || !last_name) {
            state.alert = true;
            return;
          }
          if (!email || !pass) {
            state.alert = true;
            return;
          }
          await Register(data);

          state.pageLogin = true;
        }
      } catch (error) {
        console.warn(error);
      }
      hideLoading();
    }
    return {
      state,
      LoginRegister,
    };
  },
});
</script>
