/**
 * Novel Service - API service for novel detail data
 * Currently using mock data with simulated API delays
 * Follows pattern from content.service.ts
 */

import type { NovelDetail } from "../../models/content/novel";
import { NovelDetailSchema } from "../../models/content/novel";
import { isSuccessResponse, type StandardResponse } from "../../types";
import { ApiParser } from "../../utils/parsers";

/**
 * Simulate API delay
 * Development: 200-500ms
 */
async function mockDelay(min = 200, max = 500): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Get mock novel detail data with snake_case fields
 * This will be replaced with real API calls later
 */
function getMockNovelDetail(id: string): NovelDetail {
  return {
    id,
    title: "The Chambers of Secrets",
    original_title: "Harry Potter and the Chamber of Secrets",
    slug: "chambers-of-secrets",
    cover_url: "/images/image-4.jpg",
    author: "J.K. Rowlings",
    artist: "Mary GrandPré",
    rating: 4.8,
    rating_count: 1240,
    views: 850000,
    favorites: 45000,
    status: "Completed",
    type: "Novel",
    release_year: 1998,
    description: [
      {
        type: "p",
        children: [
          {
            text: "Harry returns to Hogwarts School of Witchcraft and Wizardry for his second year. But this year, a mysterious presence is terrorizing the school. Students are being attacked and turned to stone, and a dark message appears on the wall: ",
          },
          { text: "'The Chamber of Secrets has been opened.'", bold: true },
        ],
      },
      {
        type: "p",
        children: [
          {
            text: "Harry must uncover the truth behind these attacks before Hogwarts is forced to close forever. With the help of his friends Ron and Hermione, he delves into the school's dark history and discovers secrets that have been hidden for fifty years.",
          },
        ],
      },
      {
        type: "p",
        children: [
          {
            text: "As the mystery deepens, Harry finds himself hearing strange voices in the walls and discovers he can speak Parseltongue, the language of serpents. Is Harry the heir of Slytherin? Can he save the school before it's too late?",
          },
        ],
      },
    ],
    genres: [
      { id: "1", name: "Fantasy" },
      { id: "2", name: "Adventure" },
      { id: "3", name: "Mystery" },
    ],
    tags: ["Magic", "Wizards", "School Life", "Adventure", "Young Adult"],
    volumes: [
      {
        id: "vol-1",
        novel_id: "1",
        novel_title: "The Chambers of Secrets",
        volume_number: 1,
        slug: "volume-1-the-mystery-begins",
        title: "Volume 1: The Mystery Begins",
        description:
          "Harry's second year starts with strange warnings and mysterious attacks.",
        cover_image_url: "/images/image-1.jpg",
        chapter_count: 6,
        word_count: 50000,
        display_order: 1,
        is_published: true,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        chapters: [
          {
            id: "ch-1",
            title: "Chapter 1: The Worst Birthday",
            chapter_number: 1,
            content: [],
            status: "published",
            views: 95000,
            created_at: "1 year ago",
            is_free: true,
          },
          {
            id: "ch-2",
            title: "Chapter 2: Dobby's Warning",
            chapter_number: 2,
            content: [],
            status: "published",
            views: 92000,
            created_at: "1 year ago",
            is_free: true,
          },
          {
            id: "ch-3",
            title: "Chapter 3: The Burrow",
            chapter_number: 3,
            content: [],
            status: "published",
            views: 89000,
            created_at: "1 year ago",
            is_free: true,
          },
          {
            id: "ch-4",
            title: "Chapter 4: At Flourish and Blotts",
            chapter_number: 4,
            content: [],
            status: "published",
            views: 86000,
            created_at: "1 year ago",
            is_free: true,
          },
          {
            id: "ch-5",
            title: "Chapter 5: The Whomping Willow",
            chapter_number: 5,
            content: [],
            status: "published",
            views: 83000,
            created_at: "1 year ago",
            is_free: true,
          },
          {
            id: "ch-6",
            title: "Chapter 6: Gilderoy Lockhart",
            chapter_number: 6,
            content: [],
            status: "published",
            views: 80000,
            created_at: "11 months ago",
            is_free: true,
          },
        ],
      },
      {
        id: "vol-2",
        novel_id: "1",
        novel_title: "The Chambers of Secrets",
        volume_number: 2,
        slug: "volume-2-dark-secrets",
        title: "Volume 2: Dark Secrets",
        description:
          "The Chamber of Secrets is opened and terror spreads through Hogwarts.",
        cover_image_url: "/images/image-2.jpg",
        chapter_count: 6,
        word_count: 55000,
        display_order: 2,
        is_published: true,
        created_at: "2023-02-01T00:00:00Z",
        updated_at: "2023-02-01T00:00:00Z",
        chapters: [
          {
            id: "ch-7",
            title: "Chapter 7: Mudbloods and Murmurs",
            chapter_number: 7,
            content: [],
            status: "published",
            views: 77000,
            created_at: "10 months ago",
            is_free: true,
          },
          {
            id: "ch-8",
            title: "Chapter 8: The Deathday Party",
            chapter_number: 8,
            content: [],
            status: "published",
            views: 74000,
            created_at: "9 months ago",
            is_free: true,
          },
          {
            id: "ch-9",
            title: "Chapter 9: The Writing on the Wall",
            chapter_number: 9,
            content: [],
            status: "published",
            views: 71000,
            created_at: "8 months ago",
            is_free: false,
          },
          {
            id: "ch-10",
            title: "Chapter 10: The Rogue Bludger",
            chapter_number: 10,
            content: [],
            status: "published",
            views: 68000,
            created_at: "7 months ago",
            is_free: false,
          },
          {
            id: "ch-11",
            title: "Chapter 11: The Dueling Club",
            chapter_number: 11,
            content: [],
            status: "published",
            views: 65000,
            created_at: "6 months ago",
            is_free: false,
          },
          {
            id: "ch-12",
            title: "Chapter 12: The Polyjuice Potion",
            chapter_number: 12,
            content: [],
            status: "published",
            views: 62000,
            created_at: "5 months ago",
            is_free: false,
          },
        ],
      },
      {
        id: "vol-3",
        novel_id: "1",
        novel_title: "The Chambers of Secrets",
        volume_number: 3,
        slug: "volume-3-the-truth-revealed",
        title: "Volume 3: The Truth Revealed",
        description:
          "Harry discovers the shocking truth behind the Chamber of Secrets.",
        cover_image_url: "/images/image-5.jpg",
        chapter_count: 6,
        word_count: 60000,
        display_order: 3,
        is_published: true,
        created_at: "2023-03-01T00:00:00Z",
        updated_at: "2023-03-01T00:00:00Z",
        chapters: [
          {
            id: "ch-13",
            title: "Chapter 13: The Very Secret Diary",
            chapter_number: 13,
            content: [],
            status: "published",
            views: 59000,
            created_at: "4 months ago",
            is_free: false,
          },
          {
            id: "ch-14",
            title: "Chapter 14: Cornelius Fudge",
            chapter_number: 14,
            content: [],
            status: "published",
            views: 56000,
            created_at: "3 months ago",
            is_free: false,
          },
          {
            id: "ch-15",
            title: "Chapter 15: Aragog",
            chapter_number: 15,
            content: [],
            status: "published",
            views: 53000,
            created_at: "2 months ago",
            is_free: false,
          },
          {
            id: "ch-16",
            title: "Chapter 16: The Chamber of Secrets",
            chapter_number: 16,
            content: [],
            status: "published",
            views: 50000,
            created_at: "1 month ago",
            is_free: false,
          },
          {
            id: "ch-17",
            title: "Chapter 17: The Heir of Slytherin",
            chapter_number: 17,
            content: [],
            status: "published",
            views: 47000,
            created_at: "2 weeks ago",
            is_free: false,
          },
          {
            id: "ch-18",
            title: "Chapter 18: Dobby's Reward",
            chapter_number: 18,
            content: [],
            status: "published",
            views: 44000,
            created_at: "1 week ago",
            is_free: false,
          },
        ],
      },
    ],
    reader_comments: [
      {
        id: 1,
        user: {
          name: "Roberto Jordan",
          avatar: "/images/avatar-1.jpg",
        },
        comment:
          "What a delightful and magical chapter it is! It indeed transports readers to the wizarding world.",
        rating: 5,
        time: "2 min ago",
      },
      {
        id: 2,
        user: {
          name: "Anna Henry",
          avatar: "/images/avatar-2.jpg",
        },
        comment:
          "I finished reading the chapter last night and I'm completely hooked! The mystery is getting deeper.",
        rating: 5,
        time: "1 hour ago",
      },
      {
        id: 3,
        user: {
          name: "Michael Chen",
          avatar: "/images/avatar-3.jpg",
        },
        comment: "The plot twist in this chapter was absolutely mind-blowing!",
        rating: 4,
        time: "3 hours ago",
      },
    ],
    recommendations: [
      {
        id: 1,
        title: "The Philosopher's Stone",
        subtitle: "Harry Potter Vol I",
        rating: 4.9,
        image: "/images/image-1.jpg",
      },
      {
        id: 2,
        title: "The Prisoner of Azkaban",
        subtitle: "Harry Potter Vol III",
        rating: 4.7,
        image: "/images/image-2.jpg",
      },
      {
        id: 3,
        title: "The Goblet of Fire",
        subtitle: "Harry Potter Vol IV",
        rating: 4.8,
        image: "/images/image-5.jpg",
      },
    ],
  };
}

/**
 * Novel Service Class
 */
export class NovelService {
  /**
   * Get novel detail by ID
   *
   * @param id - Novel ID
   * @example
   * ```ts
   * const novel = await NovelService.getNovelDetail('123');
   * console.log(novel.title);
   * console.log(NovelUtils.getTotalChapters(novel));
   * ```
   */
  static async getNovelDetail(id: string): Promise<NovelDetail> {
    // Simulate API call delay
    await mockDelay();

    // Simulate API response
    const response: StandardResponse<NovelDetail> = {
      success: true,
      message: "Novel detail retrieved successfully",
      data: getMockNovelDetail(id),
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch novel detail");
    }

    return ApiParser.parse(NovelDetailSchema, response);
  }

  /**
   * Check if novel is bookmarked for current user
   * TODO: Implement with real API
   *
   * @param novelId - Novel ID
   */
  static async isNovelBookmarked(novelId: string): Promise<boolean> {
    await mockDelay(100, 200);
    // TODO: Real API call
    return false;
  }
}
