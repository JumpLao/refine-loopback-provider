import { CrudSorting } from "@pankod/refine-core";

export const generateSort = (sort?: CrudSorting) => {
    if (sort && sort.length > 0) {
        const sortString = sort.map(item => {
            return `${item.field} ${item.order === 'asc' ? 'ASC' : 'DESC'}`
        }).join(',')
        return sortString
    }

    return;
};
