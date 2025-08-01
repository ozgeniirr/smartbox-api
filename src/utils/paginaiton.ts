export function getPagination(page: number = 1, limit: number = 10) {
  const currentPage = Math.max(1, page);
  const take = Math.max(1, limit);
  const skip = (currentPage - 1) * take;

  return { skip, take, currentPage };
}

export function getPaginationMeta(totalItems: number, page: number, limit: number) {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    currentPage: page,
    totalPages,
    hasNextPage: page * limit < totalItems,
    hasPreviousPage: page > 1,
  };
}
