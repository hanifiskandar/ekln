import { ref, useFetch } from '#imports';

export function useFetchStates() {
  const negeriList = ref([]);
  const error = ref(null);

  const fetchState = async () => {
    try {
      const { data, error: fetchError } = await $fetch('/api/ref_state');

      if (fetchError) {
        throw new Error(`Fetch error: ${fetchError.message}`);
      }
      
      if (data && data.data) {
        negeriList.value = data.data || [];
      } else {
        throw new Error('Data is null or undefined');
      }
    } catch (err) {
      console.error('Error fetching negeri list:', err);
      error.value = err;
    }
  };

  return {
    negeriList,
    fetchState,
    error
  };
}
