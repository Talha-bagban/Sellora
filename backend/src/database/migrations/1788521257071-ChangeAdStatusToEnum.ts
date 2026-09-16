import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeAdStatusToEnum1788521257071 implements MigrationInterface {
    name = 'ChangeAdStatusToEnum1788521257071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."ads_status_enum" AS ENUM('active', 'sold', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "ads" ADD "status" "public"."ads_status_enum" NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."ads_status_enum"`);
        await queryRunner.query(`ALTER TABLE "ads" ADD "status" character varying NOT NULL DEFAULT 'active'`);
    }

}
