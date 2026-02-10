import { keepPreviousData, useQuery } from "@tanstack/react-query";

import request from "@/lib/request";
import type { BaseFilter } from "@/types/api-response.ts";
import type { UserRes } from "./types";
import type { PaginatedResponse } from "@/types/api-response.ts";
import type { AxiosResponse } from "axios";

export const useGetUsers = (
  filter: BaseFilter,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["users-data-service", filter],
    queryFn: () =>
      request
        .get<PaginatedResponse<UserRes>>(
          `/users-data-service/users`,
          {
            params: filter,
          },
        )
        .then((res: AxiosResponse<PaginatedResponse<UserRes>>) => res.data),
    placeholderData: keepPreviousData,
    enabled: options?.enabled !== false,
  });
};
