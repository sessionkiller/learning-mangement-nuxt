import {
  useQueryClient,
  useQuery,
  useMutation,
  skipToken,
} from "@tanstack/vue-query";

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

  const getCourse = (courseId: ComputedRef<string | undefined>) => {
    const queryFn = computed(() =>
      !!courseId.value
        ? () => {
          const url = `courses/${courseId.value}`;
          return baseQuery<Course>(url);
          }
        : skipToken
    );
    return useQuery({
      queryKey: ["Courses", courseId.value],
      queryFn: queryFn
    });
  };

  const createCourse = useMutation({
    mutationFn: (body: { teacherId: string; teacherName: string }) =>
      baseQuery<Course>("courses", {
        method: "POST",
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Courses"] });
    },
  });

  const updateCourse = useMutation({
    mutationFn: ({
      courseId,
      formData,
    }: {
      courseId: string;
      formData: FormData;
    }) =>
      baseQuery<Course>(`courses/${courseId}`, {
        method: "PUT",
        body: formData,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Courses", data.courseId] });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: (courseId: string) =>
      baseQuery<{ message: string }>(`courses/${courseId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Courses"] });
    },
  });

  /*
  ===============
  TRANSACTIONS
  =============== 
  */
  const getTransactions = (userId: ComputedRef<string | undefined>) => {
    const queryFn = computed(() =>
      !!userId.value
        ? () => {
          const url = `transactions?userId=${userId.value}`;
          return baseQuery<Transaction[]>(url);
          }
        : skipToken
    );
    return useQuery({
      queryKey: ["Transactions"],
      queryFn: queryFn
    });
  };

  const createStripePaymentIntent = useMutation({
    mutationFn: ({ amount }: { amount: number }) =>
      baseQuery("transactions/stripe/payment-intent", {
        method: "POST",
        body: { amount },
      }),
  });

  const createTransaction = useMutation({
    mutationFn: (transaction: Partial<Transaction>) =>
      baseQuery("transactions", {
        method: "POST",
        body: transaction,
      }),
  });

  /* 
    ===============
    USER COURSE PROGRESS
    =============== 
    */

  const getUserEnrolledCourses = (userId: ComputedRef<string | undefined>) => {
    const queryFn = computed(() =>
      !!userId.value
        ? () => {
            const url = `users/course-progress/${userId.value}/enrolled-courses`;
            return baseQuery<Course[]>(url);
          }
        : skipToken
    );

    return useQuery({
      queryKey: ["Courses", "UserCourseProgress"],
      queryFn: queryFn,
    });
  };

  const getUserCourseProgress = (
    userId: ComputedRef<string | undefined>,
    courseId: ComputedRef<string | undefined>,
  ) => {
    const queryFn = computed(() =>
      !!userId.value && !!courseId.value
        ? () => {
          const url = `users/course-progress/${userId.value}/courses/${courseId.value}`;
          return baseQuery<UserCourseProgress>(url);
          }
        : skipToken
    );

    return useQuery({
      queryKey: ["UserCourseProgress"],
      queryFn: queryFn
    });
  };

  const updateUserCourseProgress = useMutation({
    mutationFn: ({
      userId,
      courseId,
      progressData,
    }: {
      userId: string;
      courseId: string;
      progressData: {
        sections: SectionProgress[];
      };
    }) =>
      baseQuery<UserCourseProgress>(
        `users/course-progress/${userId}/courses/${courseId}`,
        {
          method: "PUT",
          body: progressData,
        }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["UserCourseProgress"] });
    },
  });

  return {
    updateUser,
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getTransactions,
    createTransaction,
    createStripePaymentIntent,
    getUserEnrolledCourses,
    getUserCourseProgress,
    updateUserCourseProgress,
  };
};
