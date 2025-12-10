import nock from "nock";

nock("https://api.fake-rest.refine.dev:443", { encodedQueryParams: true })
    .get("/posts")
    .query({
        filter: {
            skip: 0,
            limit: 10,
            where: {
                categoryId: {
                    eq: null
                }
            }
        }
    })
    .reply(
        200,
        [
            {
                id: 1,
                title: "Post with null category",
                categoryId: null,
            },
        ],
        { "x-total-count": "1" }
    );

nock("https://api.fake-rest.refine.dev:443", { encodedQueryParams: true })
    .get("/posts")
    .query({
        filter: {
            skip: 0,
            limit: 10,
            where: {
                categoryId: {
                    neq: null
                }
            }
        }
    })
    .reply(
        200,
        [
            {
                id: 2,
                title: "Post with non-null category",
                categoryId: 1,
            },
        ],
        { "x-total-count": "1" }
    );
