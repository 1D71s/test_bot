import { Module } from '@nestjs/common';
import { AdminCategoriesService } from './services/admin-categories.service';
import { AdminCategoriesController } from './controllers/admin-categories.controller';

@Module({
  controllers: [AdminCategoriesController],
  providers: [AdminCategoriesService],
})
export class AdminCategoriesModule {}
