import { AxiosInstance, AxiosRequestHeaders } from "axios";
import { stringify } from "qs";
import { DataProvider } from "@refinedev/core";
import { axiosInstance, generateSort, generateFilter } from "./utils";

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
        // const { data, headers } = await httpClient.get(
        //     `${url}?${stringify({
        //         filter: query
        //     })}`,
        // );
        const { data, headers } = await httpClient.get(url, {
            params: {
                filter: query
            },
            // paramsSerializer: stringify
        })

        const total = +headers["x-total-count"];

        return {
            data,
            total,
        };
    },

    getMany: async ({ resource, ids }) => {
        const { data } = await httpClient.get(
            `${apiUrl}/${resource}?${stringify({ id: ids })}`,
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

    getOne: async ({ resource, id }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await httpClient.get(url);

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
