// src/composables/usePagination.ts
import { ref, computed, watch } from 'vue';

export function usePagination({ pageSize = 10, total = undefined } = {}) {
  const page = ref(1);
  const _pageSize = ref(pageSize);
  const _total = ref(total);

  function setTotal(val: number | undefined) {
    _total.value = val;
  }

  function reset() {
    page.value = 1;
  }

  function next(hasNext?: boolean) {
    if (hasNext === undefined) {
      if (_total.value !== undefined) {
        if (page.value < Math.ceil((_total.value || 0) / _pageSize.value)) page.value++;
      } else {
        page.value++;
      }
    } else if (hasNext) {
      page.value++;
    }
  }

  function prev() {
    if (page.value > 1) page.value--;
  }

  const hasPrev = computed(() => page.value > 1);
  const hasNext = computed(() => {
    if (_total.value !== undefined) {
      return page.value < Math.ceil((_total.value || 0) / _pageSize.value);
    }
    return true; // fallback, can be controlled by API result
  });

  watch(_pageSize, () => reset());

  return {
    page,
    pageSize: _pageSize,
    total: _total,
    hasPrev,
    hasNext,
    next,
    prev,
    setTotal,
    reset,
  };
}
