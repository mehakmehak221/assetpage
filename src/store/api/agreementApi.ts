import { baseApi } from './baseApi';
import { Agreement, AgreementDownloadResponse } from '@/types/agreement';

export const agreementApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // 1. GET /agreements - list my agreements
    getMyAgreements: builder.query<Agreement[], void>({
      query: () => ({
        url: 'agreements',
        method: 'GET',
      }),
      transformResponse: (response: any): Agreement[] => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.data)) return response.data;
        if (response && Array.isArray(response.items)) return response.items;
        return [];
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Agreements' as const, id })),
              { type: 'Agreements', id: 'LIST' },
            ]
          : [{ type: 'Agreements', id: 'LIST' }],
    }),

    // 2. GET /agreements/:id - agreement details
    getAgreementById: builder.query<Agreement, string>({
      query: (id) => ({
        url: `agreements/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any): Agreement => {
        return response?.data || response;
      },
      providesTags: (result, error, id) => [{ type: 'Agreements', id }],
    }),

    // 3. GET /agreements/:id/download - get pre-signed temporary PDF download link
    getAgreementDownloadUrl: builder.query<AgreementDownloadResponse, string>({
      query: (id) => ({
        url: `agreements/${id}/download`,
        method: 'GET',
      }),
      transformResponse: (response: any): AgreementDownloadResponse => {
        return response?.data || response;
      },
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetMyAgreementsQuery,
  useLazyGetMyAgreementsQuery,
  useGetAgreementByIdQuery,
  useLazyGetAgreementByIdQuery,
  useGetAgreementDownloadUrlQuery,
  useLazyGetAgreementDownloadUrlQuery,
} = agreementApi;
