import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buildWhatsappQuoteUrl } from "../../../lib/whatsapp";
import { createQuoteRequest } from "../../../services/cms.service";
import type { CreateQuoteInput } from "../../../types/domain";

export const ADMIN_QUOTES_QUERY_KEY = ["cms", "quote-requests"] as const;

export function useCreateQuoteMutation(whatsappNumber: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateQuoteInput) => {
      const saved = await createQuoteRequest(input);
      if (input.sendViaWhatsapp) {
        const whatsappUrl = buildWhatsappQuoteUrl(whatsappNumber, input);
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }
      return saved;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_QUOTES_QUERY_KEY });
    },
  });
}

