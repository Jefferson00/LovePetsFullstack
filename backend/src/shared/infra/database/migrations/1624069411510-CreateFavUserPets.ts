import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateFavUserPets1624069411510 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'favsUserPets',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
              },
              {
                name: 'user_id',
                type: 'uuid',
              },
              {
                name: 'pet_id',
                type: 'uuid',
              },
              {
                name: 'created_at',
                type: 'timestamp',
                default: 'now()',
              },
              {
                name: 'updated_at',
                type: 'timestamp',
                default: 'now()',
              },
            ],
            foreignKeys: [
                {
                    name: 'PetUser',
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    columnNames: ['user_id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                {
                    name: 'UserPet',
                    referencedTableName: 'pets',
                    referencedColumnNames: ['id'],
                    columnNames: ['pet_id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
            ],
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('favsUserPets');
      }

}
