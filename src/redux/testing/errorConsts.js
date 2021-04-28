const notFoundError = new Error();
notFoundError.status_code = 404;
const forbiddenError = new Error();
forbiddenError.status_code = 403;
const plainError = new Error();

const sagaTestingErrors = {
    notFoundError,
    forbiddenError,
    plainError
}

export default sagaTestingErrors;
