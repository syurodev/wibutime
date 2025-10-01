/**
 * Catalog domain enums mirrored from the backend catalog database schema
 * Source: system/pkg/common/model/model_catalog_enums.go
 */

export enum ContentStatus {
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  HIATUS = "HIATUS",
}

export enum SeasonName {
  SPRING = "SPRING",
  SUMMER = "SUMMER",
  FALL = "FALL",
  WINTER = "WINTER",
}

export enum CreatorRole {
  AUTHOR = "AUTHOR",
  ILLUSTRATOR = "ILLUSTRATOR",
  ARTIST = "ARTIST",
  STUDIO = "STUDIO",
  VOICE_ACTOR = "VOICE_ACTOR",
}

export enum ContentType {
  ANIME = "ANIME",
  MANGA = "MANGA",
  NOVEL = "NOVEL",
}

export enum ContentRelationType {
  ADAPTATION = "ADAPTATION",
  SEQUEL = "SEQUEL",
  SPINOFF = "SPINOFF",
  RELATED = "RELATED",
}

export enum PurchaseItemType {
  ANIME_EPISODE = "ANIME_EPISODE",
  ANIME_SEASON = "ANIME_SEASON",
  MANGA_CHAPTER = "MANGA_CHAPTER",
  MANGA_VOLUME = "MANGA_VOLUME",
  MANGA_SERIES = "MANGA_SERIES",
  NOVEL_CHAPTER = "NOVEL_CHAPTER",
  NOVEL_VOLUME = "NOVEL_VOLUME",
  NOVEL_SERIES = "NOVEL_SERIES",
}

export enum RentalItemType {
  ANIME_SEASON = "ANIME_SEASON",
  ANIME_SERIES = "ANIME_SERIES",
  MANGA_VOLUME = "MANGA_VOLUME",
  MANGA_SERIES = "MANGA_SERIES",
  NOVEL_VOLUME = "NOVEL_VOLUME",
  NOVEL_SERIES = "NOVEL_SERIES",
}

export enum SubscriptionTier {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
  VIP = "VIP",
}

// Helper arrays for dropdowns/selects
export const ContentStatusOptions = Object.values(ContentStatus);
export const SeasonNameOptions = Object.values(SeasonName);
export const CreatorRoleOptions = Object.values(CreatorRole);
export const ContentTypeOptions = Object.values(ContentType);
export const ContentRelationTypeOptions = Object.values(ContentRelationType);
export const PurchaseItemTypeOptions = Object.values(PurchaseItemType);
export const RentalItemTypeOptions = Object.values(RentalItemType);
export const SubscriptionTierOptions = Object.values(SubscriptionTier);

// Display labels for UI
export const ContentStatusLabels: Record<ContentStatus, string> = {
  [ContentStatus.ONGOING]: "Ongoing",
  [ContentStatus.COMPLETED]: "Completed",
  [ContentStatus.HIATUS]: "Hiatus",
};

export const SeasonNameLabels: Record<SeasonName, string> = {
  [SeasonName.SPRING]: "Spring",
  [SeasonName.SUMMER]: "Summer",
  [SeasonName.FALL]: "Fall",
  [SeasonName.WINTER]: "Winter",
};

export const CreatorRoleLabels: Record<CreatorRole, string> = {
  [CreatorRole.AUTHOR]: "Author",
  [CreatorRole.ILLUSTRATOR]: "Illustrator",
  [CreatorRole.ARTIST]: "Artist",
  [CreatorRole.STUDIO]: "Studio",
  [CreatorRole.VOICE_ACTOR]: "Voice Actor",
};

export const ContentTypeLabels: Record<ContentType, string> = {
  [ContentType.ANIME]: "Anime",
  [ContentType.MANGA]: "Manga",
  [ContentType.NOVEL]: "Novel",
};

export const SubscriptionTierLabels: Record<SubscriptionTier, string> = {
  [SubscriptionTier.FREE]: "Free",
  [SubscriptionTier.PREMIUM]: "Premium",
  [SubscriptionTier.VIP]: "VIP",
};
