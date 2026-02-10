import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

/**
 * Component that syncs i18n language changes with React Query
 * Invalidates all queries when language changes to refetch data with new Accept-Language header
 */
function I18nQuerySync() {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = () => {
      // Invalidate all queries to refetch with new Accept-Language header
      queryClient.invalidateQueries();
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n, queryClient]);

  return null;
}

export default I18nQuerySync;
