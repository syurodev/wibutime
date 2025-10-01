/**
 * Genre model matching backend Go struct
 * Maps to: system/pkg/common/model/model_genre.go
 */
export class Genre {
    id: string = "";
    name: string = "";
    created_at: string = "";
    updated_at: string = "";
    anime_count: number = 0;
    manga_count: number = 0;
    novel_count: number = 0;

    constructor(init?: Partial<Genre>) {
        Object.assign(this, init);
    }

    /**
     * Get total content count across all types
     */
    get totalCount(): number {
        return this.anime_count + this.manga_count + this.novel_count;
    }

    /**
     * Check if genre has any content
     */
    get hasContent(): boolean {
        return this.totalCount > 0;
    }

    /**
     * Get formatted creation date
     */
    get formattedCreatedAt(): string {
        return new Date(this.created_at).toLocaleDateString();
    }

    /**
     * Get formatted update date
     */
    get formattedUpdatedAt(): string {
        return new Date(this.updated_at).toLocaleDateString();
    }

    /**
     * Create Genre instance from API response
     */
    static fromResponse(data: any): Genre {
        return new Genre({
            id: data.id || "",
            name: data.name || "",
            created_at: data.created_at || "",
            updated_at: data.updated_at || "",
            anime_count: data.anime_count || 0,
            manga_count: data.manga_count || 0,
            novel_count: data.novel_count || 0,
        });
    }

    /**
     * Convert to plain object for API requests
     */
    toObject(): Record<string, any> {
        return {
            id: this.id,
            name: this.name,
            created_at: this.created_at,
            updated_at: this.updated_at,
            anime_count: this.anime_count,
            manga_count: this.manga_count,
            novel_count: this.novel_count,
        };
    }
}
