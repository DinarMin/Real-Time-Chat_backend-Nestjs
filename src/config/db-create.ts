import { createDatabase } from 'typeorm-extension';
import dataSource from './typeorm.datasource';

async function run() {
  try {
    console.log('Начался процесс создание базы данных');
    await createDatabase({
      options: dataSource.options,
      ifNotExist: true,
    });
    console.log('База данных успешно создана');
  } catch (error) {
    console.error('Ошибка при создание базы данных');
  } finally {
    process.exit(0);
  }
}

run();
