import { CrudOperators } from "@pankod/refine-core";

export const mapOperator = (operator: CrudOperators): string => {
    switch (operator) {
        case "ne":
            return 'neq';
        case "in":
            return "inq";
        case "contains":
            return 'ilike';
        case "ncontains":
            return 'nilike';
        case "containss":
            return 'like';
        case "ncontainss":
            return 'nlike';
        default:
            return operator;
    }
};
