/**
 * User Model - Example domain model with mapping
 */

import { BaseModel } from "./base";

/**
 * Raw user data from API (as returned by backend)
 */
export interface UserRaw {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  is_active?: boolean;
  role?: string;
}

/**
 * User domain model with mapped and computed properties
 */
export class User extends BaseModel<UserRaw> {
  readonly id: string;
  readonly email: string;
  readonly username: string | null;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly avatarUrl: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isActive: boolean;
  readonly role: string;

  constructor(raw: UserRaw) {
    super(raw);

    // Map properties (snake_case → camelCase)
    this.id = raw.id;
    this.email = raw.email;
    this.username = raw.username ?? null;
    this.firstName = raw.first_name ?? null;
    this.lastName = raw.last_name ?? null;
    this.avatarUrl = raw.avatar_url ?? null;
    this.isActive = raw.is_active ?? true;
    this.role = raw.role ?? "user";

    // Parse dates
    this.createdAt = new Date(raw.created_at);
    this.updatedAt = new Date(raw.updated_at);
  }

  /**
   * Get user's full name
   */
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.firstName || this.lastName || this.username || this.email;
  }

  /**
   * Get user's display name (username or email)
   */
  get displayName(): string {
    return this.username || this.email;
  }

  /**
   * Get user's initials for avatar
   */
  get initials(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
    }
    if (this.firstName) {
      return this.firstName[0].toUpperCase();
    }
    if (this.username) {
      return this.username[0].toUpperCase();
    }
    return this.email[0].toUpperCase();
  }

  /**
   * Check if user is admin
   */
  get isAdmin(): boolean {
    return this.role === "admin" || this.role === "superadmin";
  }

  /**
   * Format created date as relative time
   */
  getRelativeCreatedDate(locale: string = "en"): string {
    const now = new Date();
    const diffMs = now.getTime() - this.createdAt.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  /**
   * Convert to plain object (for serialization)
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      initials: this.initials,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      isActive: this.isActive,
      isAdmin: this.isAdmin,
      role: this.role,
    };
  }
}
