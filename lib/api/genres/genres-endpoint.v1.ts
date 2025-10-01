export const GenresV1Endpoint = {
    // Public endpoints (no auth required)
    getList: "/api/v1/genres",
    getById: (id: string | number) => `/api/v1/genres/${id}`,

    // Protected endpoints (admin auth required)
    create: "/api/v1/genres",
    update: (id: string | number) => `/api/v1/genres/${id}`,
    delete: (id: string | number) => `/api/v1/genres/${id}`,
};
