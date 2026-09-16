import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdImages1788522864870 implements MigrationInterface {
    name = 'CreateAdImages1788522864870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ad_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "adId" uuid NOT NULL, "imageUrl" character varying NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_bc5168dc50924c6316e405fd271" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ad_images" ADD CONSTRAINT "FK_ae25ba8daeffd0679d961582389" FOREIGN KEY ("adId") REFERENCES "ads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad_images" DROP CONSTRAINT "FK_ae25ba8daeffd0679d961582389"`);
        await queryRunner.query(`DROP TABLE "ad_images"`);
    }

}
