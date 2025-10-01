export const CreatorsV1Endpoint = {
    // Public endpoints (no auth required)
    getList: "/api/v1/creators",
    getById: (id: string | number) => `/api/v1/creators/${id}`,

    // Protected endpoints (admin auth required)
    create: "/api/v1/creators",
    update: (id: string | number) => `/api/v1/creators/${id}`,
    delete: (id: string | number) => `/api/v1/creators/${id}`,
};
