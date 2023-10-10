interface CreateSupportRequestParams {
  text: string;
}

interface GetSupportRequestsQueryParams extends Paginated {
  isActive?: boolean;
}
