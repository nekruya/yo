import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const title = query.meta?.toasterTitle || 'Error';
      toast.error(title);
      query.meta?.onError?.(error, query);
    },
    onSuccess: (data, query) => {
      query.meta?.onSuccess?.(data, query);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      const title = mutation.meta?.toasterTitle || 'Error';
      toast.error(title);
      mutation.meta?.onError?.(error, variables, context, mutation);
    },
    onSuccess: (data, variables, context, mutation) => {
      mutation.meta?.onSuccess?.(data, variables, context, mutation);
    },
  }),
}); 