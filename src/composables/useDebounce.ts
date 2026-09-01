import { ref, watch, type Ref } from 'vue';

/**
 * Custom composable that returns a debounced version of a reactive ref
 */
export function useDebounce<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debouncedValue = ref(source.value) as Ref<T>;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  watch(source, (newValue) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  return debouncedValue;
}
