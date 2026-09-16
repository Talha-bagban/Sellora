import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategories1788503894641 implements MigrationInterface {
    name = 'CreateCategories1788503894641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "leaf_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "subCategoryId" uuid NOT NULL, CONSTRAINT "PK_44fbdddf72c6fa953063cadf3b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "parentId" uuid NOT NULL, CONSTRAINT "PK_f319b046685c0e07287e76c5ab1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parent_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "icon" character varying NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8c93b2081221b1c7e9d3ba8c0fe" UNIQUE ("slug"), CONSTRAINT "PK_ca57f5a1fe8fb8fac5555f3a3b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "leaf_categories" ADD CONSTRAINT "FK_a3b71e61240551a4ce3622584a2" FOREIGN KEY ("subCategoryId") REFERENCES "sub_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_categories" ADD CONSTRAINT "FK_9bd46d8ba00a8b2a1b431c70bb7" FOREIGN KEY ("parentId") REFERENCES "parent_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_categories" DROP CONSTRAINT "FK_9bd46d8ba00a8b2a1b431c70bb7"`);
        await queryRunner.query(`ALTER TABLE "leaf_categories" DROP CONSTRAINT "FK_a3b71e61240551a4ce3622584a2"`);
        await queryRunner.query(`DROP TABLE "parent_categories"`);
        await queryRunner.query(`DROP TABLE "sub_categories"`);
        await queryRunner.query(`DROP TABLE "leaf_categories"`);
    }

}
