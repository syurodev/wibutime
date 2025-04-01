import { Module } from '@nestjs/common';

import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';

@Module({
    imports: [],
    controllers: [AuthorController],
    providers: [AuthorService],
    exports: [],
})
export class AuthorModule {}
