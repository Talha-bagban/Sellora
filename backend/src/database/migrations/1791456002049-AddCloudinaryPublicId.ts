import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCloudinaryPublicId1791456002049 implements MigrationInterface {
    name = 'AddCloudinaryPublicId1791456002049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad_images" ADD "cloudinaryPublicId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad_images" DROP COLUMN "cloudinaryPublicId"`);
    }

}
