import {
    BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AdsService } from './ads.service.js';
import { CreateAdDto } from './dto/create-ad.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UpdateAdDto } from './dto/update-ad.dto.js';
import { UpdateAdStatusDto } from './dto/update-ad-status.dto.js';
import { AdStatus } from './enums/ad-status.enum.js';
import { AdImagesService } from './ad-images.service.js';
import { UpdateImageOrderDto } from './dto/update-image-order.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ads')
export class AdsController {
  constructor(
    private readonly adsService: AdsService,
    private readonly adImagesService: AdImagesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateAdDto, @Req() req: any) {
    return this.adsService.createAd(body, req.user.userId);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('cityId') cityId?: string,
    @Query('areaId') areaId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sort') sort = 'newest',
  ) {
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(100, Math.max(1, Number(limit) || 20));

    const minPriceNumber =
      minPrice !== undefined ? Number(minPrice) : undefined;

    const maxPriceNumber =
      maxPrice !== undefined ? Number(maxPrice) : undefined;

    return this.adsService.findAll(
      pageNumber,
      limitNumber,
      search,
      categoryId,
      cityId,
      areaId,
      minPriceNumber,
      maxPriceNumber,
      sort,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyAds(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Req() req: any,
    @Query('status') status?: AdStatus,
  ) {
    const pageNumber = Math.max(1, Number(page) || 1);

    const limitNumber = Math.min(100, Math.max(1, Number(limit) || 20));

    return this.adsService.findMyAds(
      req.user.userId,
      pageNumber,
      limitNumber,
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateAdDto, @Req() req: any) {
    return this.adsService.updateAd(id, body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.adsService.deleteAd(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateAdStatusDto,
    @Req() req: any,
  ) {
    return this.adsService.updateStatus(id, body.status, req.user.userId);
  }

//   @UseGuards(JwtAuthGuard)
//   @Post(':id/images')
//   createImage(
//     @Param('id') id: string,
//     @Body() body: { imageUrl: string; sortOrder?: number },
//     @Req() req: any,
//   ) {
//     return this.adImagesService.createImage(
//       id,
//       body.imageUrl,
//       req.user.userId,
//       body.sortOrder ?? 0,
//     );
//   }

  @UseGuards(JwtAuthGuard)
  @Get(':id/images')
  findImages(@Param('id') id: string) {
    return this.adImagesService.findByAd(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('images/:imageId')
  deleteImage(@Param('imageId') imageId: string, @Req() req: any) {
    return this.adImagesService.deleteImage(imageId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('images/:imageId/order')
  updateImageOrder(
    @Param('imageId') imageId: string,
    @Body() body: UpdateImageOrderDto,
    @Req() req: any,
  ) {
    return this.adImagesService.updateOrder(
      imageId,
      body.sortOrder,
      req.user.userId,
    );
  }

  
@UseGuards(JwtAuthGuard)
@Post(':id/images/upload')
@UseInterceptors(
  FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return callback(
          new BadRequestException(
            'Only JPG, JPEG, PNG, and WEBP images are allowed',
          ),
          false,
        );
      }

      callback(null, true);
    },
  }),
)
uploadImage(
  @Param('id') id: string,
  @UploadedFile() file: any,
  @Req() req: any,
) {
    if (!file) {
        throw new BadRequestException('Image file is required');
    }

  return this.adImagesService.uploadImage(
    id,
    file,
    req.user.userId,
  );
}



}
