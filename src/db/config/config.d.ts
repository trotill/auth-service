import { Dialect } from 'sequelize/types/sequelize';

declare namespace sequelizeConfig {
  const development: {
    username: string;
    password: string;
    database: string;
    storage: string;
    dialect: Dialect;
    logging: boolean;
    define: {
      freezeTableName: boolean;
    };
  };
}

export = sequelizeConfig;
