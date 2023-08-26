<template>
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
</template>

<script>
import { defineComponent, reactive, ref, onBeforeMount } from "vue";
import { getResponsesPost } from "../service/post";
import { showLoading, hideLoading } from "src/util/plugins";

export default defineComponent({
  name: "Response",
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
      state.responsePost = await getResponsesPost(props.postDetail.id);
      hideLoading();
    }

    return {
      state,
    };
  },
});
</script>
