import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BankProduct,
  LoanProductFormData,
  ProductFilters,
  ProductStatus,
} from "../types/bank.types";
import { BankService } from "../api/bankService";
import toast from "react-hot-toast";

//query keys
export const productKeys = {
  all: ["bank-products"] as const,
  list: (filters?: ProductFilters) =>
    ["bank-products", "list", filters] as const,
  detail: (id: string) => ["bank-products", "detail", id] as const,
  rateHistory: (id: string) => ["bank-products", "rate-history", id] as const,
};

//product list

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => BankService.getProducts(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

//single product

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => BankService.getProduct(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

//Rate history

export function useProductRateHistory(id: string) {
  return useQuery({
    queryKey: productKeys.rateHistory(id),
    queryFn: () => BankService.getRateHistory(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

//create product
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoanProductFormData) =>
      BankService.createProduct(payload),
    onSuccess: (product) => {
      toast.success(`Product "${product.name}" created successfully.`);
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: () => {
      toast.error("Failed to create product. Please try again.");
    },
  });
}

//update product
export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<LoanProductFormData>) =>
      BankService.updateProduct(id, payload),
    onSuccess: (product) => {
      toast.success("Product updated. Rate notifications sent to DSAs.");
      queryClient.setQueryData(productKeys.detail(id), product);
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: () => {
      toast.error("Failed to update product.");
    },
  });
}

export function useToggleProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProductStatus }) =>
      BankService.updateProductStatus(id, status),

    // Optimistic update — flip status immediately
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: productKeys.all });
      const snapshot = queryClient.getQueriesData<{ data: BankProduct[] }>({
        queryKey: productKeys.all,
      });
      queryClient.setQueriesData<{ data: BankProduct[]; pagination: unknown }>(
        { queryKey: productKeys.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((p) => (p.id === id ? { ...p, status } : p)),
          };
        },
      );
      return { snapshot };
    },

    onSuccess: (updatedProduct) => {
      const label =
        updatedProduct.status === "ACTIVE" ? "activated" : "deactivated";
      toast.success(`Product ${label}.`);
      queryClient.setQueryData(
        productKeys.detail(updatedProduct.id),
        updatedProduct,
      );
    },

    onError: (_err, _vars, context) => {
      toast.error("Failed to update product status.");
      if (context?.snapshot) {
        context.snapshot.forEach(([queryKey, data]) =>
          queryClient.setQueryData(queryKey, data),
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BankService.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted.");
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: () => {
      toast.error("Failed to delete product.");
    },
  });
}
