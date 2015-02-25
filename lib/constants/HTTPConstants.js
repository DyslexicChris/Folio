module.exports = {
    methods: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        HEAD: 'HEAD'
    },
    statusCodes: {
        OK: 200,
        NOT_FOUND: 404,
        REQUEST_TOO_LARGE: 413,
        INTERNAL_ERROR: 500,
        NOT_IMPLEMENTED: 501
    },
    headerKeys: {
        CONTENT_TYPE: 'Content-Type'
    },
    contentTypes: {
        HTML: 'text/html',
        JSON: 'application/json'
    }
};
