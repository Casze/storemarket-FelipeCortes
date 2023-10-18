import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: 'postgres://szayqztc:ujDtQwXZ_0Vh5gqfDz3zQWIOgQbSOgNI@silly.db.elephantsql.com/szayqztc',
        host: 'silly.db.elephantsql.com',
        port: 5432,
        username: 'szayqztc',
        password: 'ujDtQwXZ_0Vh5gqfDz3zQWIOgQbSOgNI',
        database: 'szayqztc',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
