import { reactive } from 'vue';

export function createReactiveForm(fields, defaultValue = '', initialData = {}) {
    return reactive(
        Object.keys(fields).reduce((acc, step) => {
            acc[step] = fields[step].reduce((fieldAcc, field) => {
                // Use the value from initialData if available, otherwise use the defaultValue
                fieldAcc[field] = initialData[field] !== undefined
                    ? initialData[field]
                    : (field.endsWith('_file') ? null : defaultValue);
                return fieldAcc;
            }, {});
            return acc;
        }, {})
    );
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}