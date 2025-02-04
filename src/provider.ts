import { AxiosInstance, AxiosRequestHeaders } from "axios";
import { stringify } from "qs";
import { BaseKey, BaseRecord, CrudFilters, CrudSorting, GetListResponse, GetManyResponse, GetOneResponse, MetaDataQuery, Pagination, DataProvider as RefineCoreDataProvider } from "@pankod/refine-core";
import { axiosInstance, generateSort, generateFilter } from "./utils";

export interface DataProvider extends RefineCoreDataProvider {
    getList: <TData extends BaseRecord = BaseRecord>(params: {
        resource: string;
        pagination?: Pagination;
        hasPagination?: boolean;
        sort?: CrudSorting;
        filters?: CrudFilters;
        metaData?: MetaDataQuery;
        dataProviderName?: string;
        meta?: MetaDataQuery;
    }) => Promise<GetListResponse<TData>>;
    getMany?: <TData extends BaseRecord = BaseRecord>(params: {
        resource: string;
        ids: BaseKey[];
        metaData?: MetaDataQuery;
        dataProviderName?: string;
        meta?: MetaDataQuery;
    }) => Promise<GetManyResponse<TData>>;
    getOne: <TData extends BaseRecord = BaseRecord>(params: {
        resource: string;
        id: BaseKey;
        metaData?: MetaDataQuery;
        meta?: MetaDataQuery;
    }) => Promise<GetOneResponse<TData>>;
}

export const dataProvider = (
    apiUrl: string,
    httpClient: AxiosInstance = axiosInstance,
): Omit<
    Required<DataProvider>,
    "createMany" | "updateMany" | "deleteMany"
> => ({
    getList: async ({
        resource,
        hasPagination = true,
        pagination = { current: 1, pageSize: 10 },
        filters,
        sort,
        meta = {},
    }) => {
        const url = `${apiUrl}/${resource}`;

        const { current = 1, pageSize = 10 } = pagination ?? {};


        const query: {
            skip?: number;
            limit?: number;
            order?: string;
            where?: {
                [key: string]: {
                    [key: string]: any
                }
            }
        } = hasPagination
            ? {
                  skip: (current - 1) * pageSize,
                  limit: pageSize,
              }
            : {};

        const queryFilters = generateFilter(filters);
        if (queryFilters) {
            query.where = queryFilters
        }

        const generatedSort = generateSort(sort);
        if (generatedSort) {
            query.order = generatedSort
        }

        const { fields, include } = meta;

        // const { data, headers } = await httpClient.get(
        //     `${url}?${stringify({
        //         filter: query
        //     })}`,
        // );
        const { data, headers } = await httpClient.get(url, {
            params: {
                filter: {
                    ...query,
                    fields: fields,
                    include: include,
                },
            },
            // paramsSerializer: stringify
        })

        const total = +headers["x-total-count"];

        return {
            data,
            total,
        };
    },

    getMany: async ({ resource, ids, meta = {} }) => {
        const { fields, include } = meta;
        const { data } = await httpClient.get(
            `${apiUrl}/${resource}?${stringify({ id: ids })}`,
            {
                params: {
                    filter: {
                        where: {
                            id: { inq : ids },
                        },
                        fields: fields,
                        include: include,
                    },
                },
            },
        );

        return {
            data,
        };
    },

    create: async ({ resource, variables }) => {
        const url = `${apiUrl}/${resource}`;

        const { data } = await httpClient.post(url, variables);

        return {
            data,
        };
    },

    update: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await httpClient.patch(url, variables);

        return {
            data,
        };
    },

    getOne: async ({ resource, id, meta = {} }) => {
        const url = `${apiUrl}/${resource}/${id}`;
        const { fields, include } = meta;

        const { data } = await httpClient.get(url, {
            params: {
                filter: {
                    fields: fields,
                    include: include,
                },
            },
        });

        return {
            data,
        };
    },

    deleteOne: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await httpClient.delete(url, {
            data: variables,
        });

        return {
            data,
        };
    },

    getApiUrl: () => {
        return apiUrl;
    },

    custom: async ({ url, method, filters, sort, payload, query, headers }) => {
        // let requestUrl = `${url}?`;

        // if (sort) {
        //     const generatedSort = generateSort(sort);
        //     if (generatedSort) {
        //         const sortQuery = {
        //             order: generatedSort
        //         };
        //         requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
        //     }
        // }

        // if (filters) {
        //     const filterQuery = generateFilter(filters);
        //     requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
        // }

        // if (query) {
        //     requestUrl = `${requestUrl}&${stringify(query)}`;
        // }

        if (headers) {
            httpClient.defaults.headers = {
                ...httpClient.defaults.headers,
                ...headers as AxiosRequestHeaders,
            };
        }

        let axiosResponse;
        switch (method) {
            case "put":
            case "post":
            case "patch":
                axiosResponse = await httpClient[method](url, payload);
                break;
            case "delete":
                axiosResponse = await httpClient.delete(url, {
                    data: payload,
                });
                break;
            default:
                axiosResponse = await httpClient.get(url, {
                    params: query,
                    // paramsSerializer: stringify
                });
                break;
        }

        const { data } = axiosResponse;

        return Promise.resolve({ data });
    },
});
