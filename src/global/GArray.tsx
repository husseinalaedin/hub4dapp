export class GArray {
    static sort(array, in_obj_name, sortCriteria) {
        return array.sort((a, b) => {
            for (const criterion of sortCriteria) {
                const { field, order } = criterion;
                let comparison;
                if (in_obj_name!='')
                    comparison = a[in_obj_name][field] > b[in_obj_name][field] ? 1 : a[in_obj_name][field] < b[in_obj_name][field] ? -1 : 0;
                else
                    comparison = a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;

                if (comparison !== 0) {
                    // If the values are different, return the result based on the sorting order
                    return order === 'desc' ? -comparison : comparison;
                }
            }

            // If all criteria are equal, maintain the original order
            return 0;
        });
    }
    static csv_to_array(csv) {

    }
}