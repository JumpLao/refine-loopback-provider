/**
 * @jest-environment node
 */

import axios from "axios";

import JsonServer from "../../src/index";
import "./index.mock";

// axios.defaults.adapter = require("axios/lib/adapters/http");

describe("getList", () => {
    it("correct response", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({ resource: "posts" });

        expect(response.data[0]["id"]).toBe(1);
        expect(response.data[0]["title"]).toBe(
            "Mollitia ipsam nisi in porro velit asperiores et quaerat dolorem.",
        );
        expect(response.total).toBe(1000);
    });

    it("correct sorting response", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({
            resource: "posts",
            sort: [
                {
                    field: "id",
                    order: "asc",
                },
            ],
        });

        expect(response.data[0]["id"]).toBe(1);
        expect(response.data[0]["title"]).toBe(
            "Mollitia ipsam nisi in porro velit asperiores et quaerat dolorem.",
        );
        expect(response.total).toBe(1000);
    });

    it("correct filter response", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({
            resource: "posts",
            filters: [
                {
                    field: "categoryId",
                    operator: "eq",
                    value: "1",
                },
            ],
        });

        expect(response.data[0]["category"]["id"]).toBe(1);
        expect(response.total).toBe(17);
    });

    it("correct filter and sort response", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({
            resource: "posts",
            filters: [
                {
                    field: "categoryId",
                    operator: "eq",
                    value: "1",
                },
            ],
            sort: [
                {
                    field: "id",
                    order: "asc",
                },
            ],
        });

        expect(response.data[0]["category"]["id"]).toBe(1);
        expect(response.total).toBe(17);
    });

    it("correct filter and condition", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({
            resource: "posts",
            filters: [
                {
                    operator: 'and',
                    value: [
                        {
                            field: "categoryId",
                            operator: "eq",
                            value: "1",
                        },
                        {
                            field: "id",
                            operator: "eq",
                            value: "44",
                        },
                    ]
                }
            ]
        });

        expect(response.data[0]["id"]).toBe(44);
        expect(response.total).toBe(1);
    });
    it("correct filter or condition", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({
            resource: "posts",
            filters: [
                {
                    operator: 'or',
                    value: [
                        {
                            field: "categoryId",
                            operator: "eq",
                            value: "1",
                        },
                        {
                            field: "id",
                            operator: "eq",
                            value: "44",
                        },
                    ]
                }
            ]
        });

        expect(response.data[0]["id"]).toBe(44);
        expect(response.total).toBe(17);
    });

    it("correct meta.fields", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({
            resource: "posts",
            meta: {
                fields: ['id'],
            },
        });

        expect(response.data[0]).toEqual({id: 1})
    });

    it("correct meta.include", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({
            resource: "posts",
            meta: {
                include: 'auditor',
            },
        });

        expect(response.data[0]).toEqual({
            id: 1,
            title: "Mollitia ipsam nisi in porro velit asperiores et quaerat dolorem.",
            slug: "vel-qui-dolorem",
            content:
                "Quam ducimus soluta voluptas qui illum recusandae occaecati. Inventore voluptate labore non. Perferendis dolorem cupiditate nemo iusto ut qui iure et. Iusto sunt ipsam et quia placeat minima odio. Et doloremque quis similique nulla vel omnis et vel ut. Dolorem totam similique est dignissimos fugit minima. Occaecati veniam suscipit quae quasi occaecati non illum incidunt omnis. Qui at fugiat non voluptatum quis. Autem odio voluptates vero qui temporibus. Repellendus et voluptatum.",
            hit: 858512,
            category: { id: 44 },
            user: { id: 14 },
            status: "rejected",
            createdAt: "2021-04-28T19:43:05.203Z",
            image: [
                {
                    url: "http://placeimg.com/640/480",
                    name: "9144d5cd-977a-42fe-bfee-bcce61c567e8",
                    status: "done",
                    type: "image/jpeg",
                    uid: "da9b6491-5820-4347-90a0-cb735a21d787",
                },
            ],
            tags: [7, 5, 6],
            language: 3,
            auditorId: 17,
            auditor: {
                firstName: 'modi-unde',
                lastName: 'labore',
            },
        });
    });

    it("correct meta.fields and meta.include", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({
            resource: "posts",
            meta: {
                fields: ['id'],
                include: 'auditor',
            },
        });

        expect(response.data[0]).toEqual({
            id: 1,
            auditor: {
                firstName: 'modi-unde',
                lastName: 'labore',
            }
        });
    });
});
