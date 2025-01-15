import { useQueryClient, useQuery, useMutation } from "@tanstack/vue-query";

export const useApi = () => {
  const queryClient = useQueryClient();
  const runtimeConfig = useRuntimeConfig();

  const toast = useToast();

  const baseQuery = async <T>(
    endpoint: string,
    options: any = { method: "GET" }
  ): Promise<T> => {
    const baseUrl = runtimeConfig.public.apiBaseUrl;

    const token = await window.Clerk?.session?.getToken();

    const headers = {
      ...options.headers, // Merge any existing headers
      Authorization: token ? `Bearer ${token}` : undefined,
    };

    try {
      let result = await $fetch(`${baseUrl}/${endpoint}`, {
        ...options,
        headers,
      });

      if (result.error) {
        const errorMessage = result?.message || "An error occurred";
        toast.add({
          severity: "error",
          detail: `Error: ${errorMessage}`,
          life: 3000,
        });
        throw new Error(errorMessage);
      }

      const isMutationRequest = options.method !== "GET";

      if (isMutationRequest) {
        const successMessage = result.data?.message;
        if (successMessage)
          toast.add({
            severity: "success",
            detail: successMessage,
            life: 3000,
          });
      }

      if (result.data) {
        result = result.data;
      } else if (
        result.error?.status === 204 ||
        result.meta?.response?.status === 24
      ) {
        return { data: null } as T;
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      throw new Error(errorMessage);
    }
  };

  /* 
    ===============
    USER CLERK
    =============== 
    */
  const updateUser = useMutation({
    mutationFn: ({ userId, ...updatedUser }: User & { userId: string }) =>
      baseQuery(`users/clerk/${userId}`, {
        method: "PUT",
        body: updatedUser,
      }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });

  /* 
    ===============
    COURSES
    =============== 
    */
  const getCourses = (category?: string) => {
    return useQuery({
      queryKey: ["Courses"], // Static queryKey
      queryFn: () => {
        const url = category ? `courses?category=${category}` : `courses`;
        return baseQuery<Course[]>(url);
      },
    });
  };

  const getCourse = (id: string) => {
    return useQuery({
      queryKey: ["Courses", id],
      queryFn: () => {
        const url = `courses/${id}`;
        return baseQuery<Course>(url);
      },
    });
  };

  /*
  ===============
  TRANSACTIONS
  =============== 
  */
  const getTransactions = (userId: string, enabled = true) => {
    return useQuery({
      queryKey: ["Transactions"],
      queryFn: () => {
        const url = `transactions?userId=${userId}`;
        return baseQuery<Transaction[]>(url);
      },
      enabled,
    });
  };

  return {
    updateUser,
    getCourses,
    getCourse,
    getTransactions,
  };
};
