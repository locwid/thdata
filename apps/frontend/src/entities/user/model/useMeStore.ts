import { defineStore } from "pinia";
import { computed, shallowRef } from "vue";
import type { VMe } from "./me";

export const useMeStore = defineStore("me", () => {
  const unsafeMe = shallowRef<VMe | null>(null);

  const me = computed(() => {
    if (!unsafeMe.value) {
      throw new Error("Me is not set");
    }
    return unsafeMe.value;
  });

  const isAuthenticated = computed(() => {
    return unsafeMe.value !== null;
  });

  const setMe = (newMe: VMe | null) => {
    unsafeMe.value = newMe;
  };

  return {
    me,
    isAuthenticated,
    setMe,
  };
});
