export function createRequestActions(name) {
    return {
        request: `${name}_REQUEST`.toUpperCase(),
        success: `${name}_SUCCESS`.toUpperCase(),
        failure: `${name}_FAILURE`.toUpperCase(),
    }
}

function toCamel (s) {
    return s.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            .replace("-", "")
            .replace("_", "");
    });
}

export function createRequestFunctions(actions) {
    const result = {};
    for (const [key, value] of Object.entries(actions)) {
        const lowered = value.toLowerCase();
        if (key === "request") {
            const newKey = `${toCamel(lowered)}`;
            result[newKey] = (input) => {
                return {type: value, input}
            }
        } else if (key === "success") {
            const newKey = `${toCamel(lowered)}`
            result[newKey] = (data) => {
                return {type: value, data}
            }
        } else if (key === "failure") {
            const newKey = `${toCamel(lowered)}`
            result[newKey] = (error) => {
                return {type: value, error}
            }
        }
    }
    return result;
}
