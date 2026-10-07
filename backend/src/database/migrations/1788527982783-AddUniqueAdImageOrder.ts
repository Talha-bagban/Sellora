import type { QueryRunner } from "typeorm";
import type { MigrationInterface } from "typeorm";

export class AddUniqueAdImageOrder1788527982783 implements MigrationInterface {
    name = 'AddUniqueAdImageOrder1788527982783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad_images" ADD CONSTRAINT "UQ_7970dc9e315ccbf5e0ab5b22cd5" UNIQUE ("adId", "sortOrder")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad_images" DROP CONSTRAINT "UQ_7970dc9e315ccbf5e0ab5b22cd5"`);
    }

}
