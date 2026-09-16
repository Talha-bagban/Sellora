import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdImage } from './ad-image.entity';
import { Ad } from './ad.entity';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { writeFile } from 'fs/promises';

@Injectable()
export class AdImagesService {
  constructor(
    @InjectRepository(AdImage)
    private readonly adImageRepository: Repository<AdImage>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
  ) {}

  //   async createImage(
  //     adId: string,
  //     imageUrl: string,
  //     userId: string,
  //     sortOrder = 0,
  //   ) {
  //     const ad = await this.adRepository.findOne({
  //       where: { id: adId },
  //     });

  //     if (!ad) {
  //       throw new NotFoundException('Ad not found');
  //     }

  //     if (ad.userId !== userId) {
  //       throw new ForbiddenException(
  //         'You are not allowed to add images to this ad',
  //       );
  //     }

  //     const imageCount = await this.adImageRepository.count({
  //       where: { adId },
  //     });

  //     if (imageCount >= 5) {
  //       throw new BadRequestException('An ad can have a maximum of 10 images');
  //     }

  //     const image = this.adImageRepository.create({
  //       adId,
  //       imageUrl,
  //       sortOrder,
  //     });

  //     await this.adImageRepository.save(image);

  //     return {
  //       id: image.id,
  //       adId: image.adId,
  //       imageUrl: image.imageUrl,
  //       sortOrder: image.sortOrder,
  //     };
  //   }

  async findByAd(adId: string) {
    return this.adImageRepository.find({
      where: { adId },
      order: {
        sortOrder: 'ASC',
      },
    });
  }

  async deleteImage(imageId: string, userId: string) {
    const image = await this.adImageRepository.findOne({
      where: { id: imageId },
      relations: {
        ad: true,
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.ad.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this image');
    }

    await this.adImageRepository.remove(image);

    return {
      message: 'Image deleted successfully',
    };
  }

  //   async updateOrder(imageId: string, sortOrder: number, userId: string) {
  //     const image = await this.adImageRepository.findOne({
  //       where: { id: imageId },
  //       relations: {
  //         ad: true,
  //       },
  //     });

  //     if (!image) {
  //       throw new NotFoundException('Image not found');
  //     }

  //     if (image.ad.userId !== userId) {
  //       throw new ForbiddenException('You are not allowed to update this image');
  //     }

  //     image.sortOrder = sortOrder;

  //     await this.adImageRepository.save(image);

  //     return {
  //       id: image.id,
  //       adId: image.adId,
  //       imageUrl: image.imageUrl,
  //       sortOrder: image.sortOrder,
  //     };
  //   }

  async updateOrder(imageId: string, sortOrder: number, userId: string) {
    return this.adImageRepository.manager.transaction(async (manager) => {
      const image = await manager.findOne(AdImage, {
        where: { id: imageId },
        relations: {
          ad: true,
        },
      });

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      if (image.ad.userId !== userId) {
        throw new ForbiddenException(
          'You are not allowed to update this image',
        );
      }

      const images = await manager.find(AdImage, {
        where: { adId: image.adId },
        order: {
          sortOrder: 'ASC',
        },
      });

      if (sortOrder >= images.length) {
        throw new BadRequestException(
          `sortOrder must be between 0 and ${images.length - 1}`,
        );
      }

      const currentIndex = images.findIndex((item) => item.id === imageId);

      const [selectedImage] = images.splice(currentIndex, 1);

      images.splice(sortOrder, 0, selectedImage);

      // Temporarily move all images to avoid unique constraint conflicts.
      for (let i = 0; i < images.length; i++) {
        await manager.update(AdImage, images[i].id, { sortOrder: 1000 + i });
      }

      // Apply the final ordering.
      for (let i = 0; i < images.length; i++) {
        await manager.update(AdImage, images[i].id, { sortOrder: i });
      }

      const updatedImage = images[sortOrder];

      return {
        id: updatedImage.id,
        adId: updatedImage.adId,
        imageUrl: updatedImage.imageUrl,
        sortOrder: updatedImage.sortOrder,
      };
    });
  }

  async uploadImage(adId: string, file: any, userId: string) {
    const ad = await this.adRepository.findOne({
      where: { id: adId },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    if (ad.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to add images to this ad',
      );
    }

    const imageCount = await this.adImageRepository.count({
      where: { adId },
    });

    if (imageCount >= 10) {
      throw new BadRequestException('An ad can have a maximum of 10 images');
    }

    const fileName = `${randomUUID()}-${file.originalname}`;

    const filePath = join(process.cwd(), 'uploads', 'ads', fileName);

    await writeFile(filePath, file.buffer);

    const image = this.adImageRepository.create({
      adId,
      imageUrl: `/uploads/ads/${fileName}`,
      sortOrder: imageCount,
    });

    await this.adImageRepository.save(image);

    return {
      id: image.id,
      adId: image.adId,
      imageUrl: image.imageUrl,
      sortOrder: image.sortOrder,
    };
  }
}
