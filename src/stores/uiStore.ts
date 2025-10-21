import { ref } from 'vue';
import { defineStore } from 'pinia';

// General UI store for any UI-related state (selections, modals, etc.)
export const useUIStore = defineStore(
  'ui',
  () => {
    const selections = ref<Record<string, unknown>>({});

    /**
     * Set a UI selection value by key.
     * @param key - The selection key (string)
     * @param value - The value to store (any type)
     */
    function setSelection(key: string, value: unknown) {
      selections.value[key] = value;
    }

    /**
     * Get a UI selection value by key.
     * @param key - The selection key (string)
     * @returns The stored value, or undefined if not set
     */
    function getSelection(key: string) {
      return selections.value[key];
    }

    /**
     * Clear a specific selection by key, or all selections if no key is provided.
     * @param key - (Optional) The selection key to clear
     */
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
  },
  {
    persist: true,
  }
);
