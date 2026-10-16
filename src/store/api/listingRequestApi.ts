import { baseApi } from './baseApi';
import {
  ListingRequestOptionsResponse,
  CreateListingRequestDto,
  CreateListingRequestResponse,
  MyListingRequestsResponse,
  MyListingRequestsParams,
} from '@/types/listingRequest';

export const listingRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListingRequestOptions: builder.query<ListingRequestOptionsResponse, void>({
      query: () => ({
        url: 'listing-requests/options',
        method: 'GET',
      }),
    }),
    createListingRequest: builder.mutation<CreateListingRequestResponse, CreateListingRequestDto>({
      query: (body) => ({
        url: 'listing-requests',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['ListingRequest'],
    }),

    getMyListingRequests: builder.query<MyListingRequestsResponse, MyListingRequestsParams | void>({
      query: (params) => {
        const queryParams = params ? params : {};
        return {
          url: 'listing-requests/my',
          method: 'GET',
          params: {
            page: queryParams.page ?? 1,
            limit: queryParams.limit ?? 20,
          },
        };
      },
      providesTags: ['ListingRequest'],
    }),
  }),
});

export const {
  useGetListingRequestOptionsQuery,
  useCreateListingRequestMutation,
  useGetMyListingRequestsQuery,
} = listingRequestApi;
