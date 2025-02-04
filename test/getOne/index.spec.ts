/**
 * @jest-environment node
 */

import axios from "axios";

import JsonServer from "../../src/index";
import "./index.mock";

// axios.defaults.adapter = require("axios/lib/adapters/http");

describe("getOne", () => {
    it("correct response", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getOne({ resource: "posts", id: "1" });

        const { data } = response;

        expect(data.id).toBe(1);
        expect(data.title).toBe(
            "Deleniti et quasi architecto hic quam et tempora vero quo.",
        );
    });

    it("correct meta.fields", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getOne({
            resource: "posts",
            id: "1",
            meta: {
                fields: ['id'],
            },
        });

        const { data } = response;

        expect(data).toEqual({
            id: 1,
        });
    });

    it("correct meta.include", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getOne({
            resource: "posts",
            id: "1",
            meta: {
                include: 'auditor',
            },
        });

        const { data } = response;

        expect(data).toEqual({
            id: 1,
            title: "Deleniti et quasi architecto hic quam et tempora vero quo.",
            slug: "nobis-aut-eligendi",
            content:
                "Accusantium sed nam odio ut non qui. Maxime quaerat sed ducimus corrupti consequatur. Facere numquam ut reprehenderit quaerat quia. Recusandae quibusdam asperiores atque architecto quod praesentium sit non. Aut neque repellat veniam veritatis qui et vel alias debitis. Amet eius omnis dolores. Sint sed magni. Dolor eius maiores asperiores et. Et modi illum eius quisquam maxime at vel qui. Sit dolore officiis aliquid quia labore.",
            categoryId: 20,
            status: "active",
            userId: 16,
            tags: [15, 36, 46],
            image: [],
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
        ).getOne({
            resource: "posts",
            id: "1",
            meta: {
                fields: ['id'],
                include: 'auditor',
            },
        });

        const { data } = response;

        expect(data).toEqual({
            id: 1,
            auditor: {
                firstName: 'modi-unde',
                lastName: 'labore',
            }
        });
    });
});
