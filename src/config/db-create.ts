import { createDatabase } from 'typeorm-extension';
import dataSource from './typeorm.datasource';

async function run() {
  try {
    console.log('Начался процесс в инициализации базы данных');
    console.log('В процессе...');
    await createDatabase({
      options: dataSource.options,
      ifNotExist: true,
    });
    console.log('Инициализация базы данных успешна!');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных');
  } finally {
    process.exit(0);
  }
}

run();
