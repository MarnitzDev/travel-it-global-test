import { ref } from 'vue';
import { defineStore } from 'pinia';

// General UI store for any UI-related state (selections, modals, etc.)
export const useUIStore = defineStore('ui', () => {
  const selections = ref<Record<string, unknown>>({});

  function setSelection(key: string, value: unknown) {
    selections.value[key] = value;
  }

  function getSelection(key: string) {
    return selections.value[key];
  }

  function clearSelection(key?: string) {
    if (key) {
      delete selections.value[key];
    } else {
      selections.value = {};
    }
  }

  return {
    selections,
    setSelection,
    getSelection,
    clearSelection,
  };
}, {
  persist: true
});
