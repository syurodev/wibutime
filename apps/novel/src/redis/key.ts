export abstract class REDIS_KEY {
    static readonly ACCESS_TOKEN = (userId: number | string, token: string) =>
        `ACCESS_TOKEN:${userId}:${token}`;

    static CACHE_KEY(key: string, prefix?: string) {
        return `CACHE:${prefix ? `${prefix}:` : ''}${key}`;
    }
}
