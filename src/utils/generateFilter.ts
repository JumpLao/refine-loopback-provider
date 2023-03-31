import { CrudFilters } from "@refinedev/core";
import { mapOperator } from "./mapOperator";

export const generateFilter = (filters?: CrudFilters) => {
    const queryFilters: { [key: string]: {[key: string]: any} } = {};

    if (filters) {
        filters.map((filter) => {
            if (filter.operator === "or" || filter.operator === "and") {
                // throw new Error(
                //     `[@pankod/refine-simple-rest]: \`operator: ${filter.operator}\` is not supported. You can create custom data provider. https://refine.dev/docs/api-reference/core/providers/data-provider/#creating-a-data-provider`,
                // );
                queryFilters[filter.operator] = filter.value.map(f => generateFilter([f]))
                return 
            }

            if ("field" in filter) {
                const { field, operator, value } = filter;

                if (field === "q") {
                    queryFilters[field] = value;
                    return;
                }

                const mappedOperator = mapOperator(operator);
                queryFilters[field] = {
                    [mappedOperator]: value
                };
            }
        });
    }
    return queryFilters;
};
