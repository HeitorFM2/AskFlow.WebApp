import { LocalStorage } from "quasar";

export function logout() {
  LocalStorage.clear();
  location.href = "/";
}
