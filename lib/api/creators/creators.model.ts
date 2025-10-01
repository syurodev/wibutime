/**
 * Creator model matching backend Go struct
 * Maps to: system/pkg/common/model/model_creator.go
 */
export class Creator {
    id: string = "";
    name: string = "";
    description?: string;
    created_at: string = "";
    updated_at: string = "";

    constructor(init?: Partial<Creator>) {
        Object.assign(this, init);
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
     * Get creator initials for avatar display
     */
    get initials(): string {
        return this.name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    /**
     * Check if creator has description
     */
    get hasDescription(): boolean {
        return Boolean(this.description && this.description.trim().length > 0);
    }

    /**
     * Get truncated description for preview
     */
    getTruncatedDescription(maxLength: number = 100): string {
        if (!this.description) return "";

        if (this.description.length <= maxLength) {
            return this.description;
        }

        return this.description.slice(0, maxLength).trim() + "...";
    }

    /**
     * Create Creator instance from API response
     */
    static fromResponse(data: any): Creator {
        return new Creator({
            id: data.id || "",
            name: data.name || "",
            description: data.description || undefined,
            created_at: data.created_at || "",
            updated_at: data.updated_at || "",
        });
    }

    /**
     * Convert to plain object for API requests
     */
    toObject(): Record<string, any> {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }

    /**
     * Convert to create/update request format
     */
    toRequestObject(): { name: string; description?: string } {
        return {
            name: this.name,
            description: this.description,
        };
    }
}
