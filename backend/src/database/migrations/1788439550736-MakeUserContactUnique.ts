import type { QueryRunner } from "typeorm";
import type { MigrationInterface } from "typeorm";

export class MakeUserContactUnique1788439550736 implements MigrationInterface {
    name = 'MakeUserContactUnique1788439550736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"`);
    }

}
