import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { AuthService } from "src/services/auth.service";
import { UsersService } from "src/services/users.service";

const KEY_TOKEN = "accessToken";
const KEY_REFRESH = "refreshToken";
const KEY_USER = "user";

function loadUser() {
  try {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref(loadUser());
  const accessToken = ref(localStorage.getItem(KEY_TOKEN));

  const isAuthenticated = computed(() => !!accessToken.value);

  async function login(email, password) {
    console.log("API URL:", process.env.VUE_APP_API);
    const data = await AuthService.login({ email, password });
    _persist(data);
    return data;
  }

  async function register(email, password, userName, identification) {
    const data = await AuthService.register({
      email,
      password,
      userName,
      identification,
    });
    _persist(data);
    return data;
  }

  async function logout() {
    try {
      if (accessToken.value) await AuthService.logout();
    } catch {
      // logout locally even if API call fails
    } finally {
      _clear();
    }
  }

  function _persist(data) {
    accessToken.value = data.accessToken;
    user.value = data.user;
    localStorage.setItem(KEY_TOKEN, data.accessToken);
    localStorage.setItem(KEY_REFRESH, data.refreshToken);
    localStorage.setItem(KEY_USER, JSON.stringify(data.user));
  }

  async function updateAvatar(file) {
    const avatarUrl = await UsersService.updateAvatar(file);
    if (user.value && avatarUrl) {
      user.value = { ...user.value, avatarUrl };
      localStorage.setItem(KEY_USER, JSON.stringify(user.value));
    }
  }

  function _clear() {
    accessToken.value = null;
    user.value = null;
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_REFRESH);
    localStorage.removeItem(KEY_USER);
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    register,
    logout,
    updateAvatar,
  };
});
