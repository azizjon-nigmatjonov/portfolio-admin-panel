export type BaseFilter = {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  archivePeriod?: string;
};

interface SortInfo {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export type PaginatedResponse<T> = {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  empty: boolean;
};
