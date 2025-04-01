import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { VERSION_CONTROLLER_ENUM } from '@workspace/types';
import { ArtistModule } from './artist/artist.module';
import { AuthorModule } from './author/author.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ChapterModule } from './chapter/chapter.module';
import { GenreModule } from './genre/genre.module';
import { LightnovelGenreMapModule } from './lightnovel-genre-map/lightnovel-genre-map.module';
import { LightnovelVolumeMapModule } from './lightnovel-volume-map/lightnovel-volume-map.module';
import { LightnovelModule } from './lightnovel/lightnovel.module';
import { ReadingHistoryModule } from './reading-history/reading-history.module';
import { VolumeChapterMapModule } from './volume-chapter-map/volume-chapter-map.module';
import { VolumeModule } from './volume/volume.module';

const routes: Routes = [
  {
    path: VERSION_CONTROLLER_ENUM.V1,

    children: [
      LightnovelModule,
      VolumeModule,
      ChapterModule,
      AuthorModule,
      ArtistModule,
      GenreModule,
      VolumeChapterMapModule,
      LightnovelVolumeMapModule,
      LightnovelGenreMapModule,
      ReadingHistoryModule,
      BookmarkModule,
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    LightnovelModule,
    VolumeModule,
    ChapterModule,
    AuthorModule,
    ArtistModule,
    GenreModule,
    VolumeChapterMapModule,
    LightnovelVolumeMapModule,
    LightnovelGenreMapModule,
    ReadingHistoryModule,
    BookmarkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppV1Module {}
