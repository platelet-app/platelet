export function createRequestActions(prefix) {
    return {
        request: `${prefix}_REQUEST`.toUpperCase(),
        success: `${prefix}_SUCCESS`.toUpperCase(),
        failure: `${prefix}_FAILURE`.toUpperCase(),
        notFound: `${prefix}_NOT_FOUND`.toUpperCase(),
        forbidden: `${prefix}_FORBIDDEN`.toUpperCase(),
    }
}

export function toCamel (s) {
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
                return {type: value, data, fetched: true}
            }
        } else if (["failure", "notFound", "forbidden"].includes(key)) {
            const newKey = `${toCamel(lowered)}`
            result[newKey] = (error) => {
                return {type: value, error}
            }
        }
    }
    return result;
}
