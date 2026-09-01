import { describe, it, expect, vi } from 'vitest';
import { ref, nextTick } from 'vue';
import { useDebounce } from '../../src/composables/useDebounce';

describe('useDebounce composable', () => {
  it('should update debounced value after specified delay', async () => {
    vi.useFakeTimers();

    const searchTerm = ref('Vue');
    const debounced = useDebounce(searchTerm, 300);

    expect(debounced.value).toBe('Vue');

    searchTerm.value = 'Vue.js 3';
    await nextTick();

    expect(debounced.value).toBe('Vue'); // Not updated immediately

    vi.advanceTimersByTime(350);
    expect(debounced.value).toBe('Vue.js 3'); // Updated after delay

    vi.useRealTimers();
  });
});
