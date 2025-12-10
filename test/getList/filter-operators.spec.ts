/**
 * @jest-environment node
 */

import axios from "axios";
import JsonServer from "../../src/index";
import "./filter-operators.mock";

describe("getList with null operators", () => {
    it("correct response for 'null' operator", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({
            resource: "posts",
            filters: [
                {
                    field: "categoryId",
                    operator: "null",
                    value: "some_value" // Value should be ignored
                },
            ],
        });

        expect(response.data[0]["id"]).toBe(1);
        expect(response.total).toBe(1);
    });

    it("correct response for 'nnull' operator", async () => {
        const response = await JsonServer(
            "https://api.fake-rest.refine.dev",
            axios,
        ).getList({
            resource: "posts",
            filters: [
                {
                    field: "categoryId",
                    operator: "nnull",
                    value: "some_value" // Value should be ignored
                },
            ],
        });

        expect(response.data[0]["id"]).toBe(2);
        expect(response.total).toBe(1);
    });
});
