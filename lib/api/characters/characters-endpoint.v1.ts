export const CharactersV1Endpoint = {
    // Public endpoints (no auth required)
    getList: "/api/v1/characters",
    getById: (id: string | number) => `/api/v1/characters/${id}`,

    // Protected endpoints (admin auth required)
    create: "/api/v1/characters",
    update: (id: string | number) => `/api/v1/characters/${id}`,
    delete: (id: string | number) => `/api/v1/characters/${id}`,
};