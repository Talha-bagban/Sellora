import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAds1788507416410 implements MigrationInterface {
    name = 'CreateAds1788507416410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "price" numeric NOT NULL, "categoryId" uuid NOT NULL, "cityId" uuid NOT NULL, "areaId" uuid NOT NULL, "userId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "views" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7af7d1998037a97076f758fc23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_a41fea69f8e459557f6f7fdb5f3" FOREIGN KEY ("categoryId") REFERENCES "leaf_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_020949624ba48d2e29cc5316896" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_93d08398487a85c11bec95583d9" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_e72da72588dc5b91427a9adda71" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_e72da72588dc5b91427a9adda71"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_93d08398487a85c11bec95583d9"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_020949624ba48d2e29cc5316896"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_a41fea69f8e459557f6f7fdb5f3"`);
        await queryRunner.query(`DROP TABLE "ads"`);
    }

}
