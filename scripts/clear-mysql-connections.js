#!/usr/bin/env node

/**
 * Скрипт для очистки зависших подключений к MySQL
 * Использование: node scripts/clear-mysql-connections.js
 */

const mysql = require('mysql2/promise');

async function clearConnections() {
  const connection = await mysql.createConnection({
    host: '147.45.138.77',
    port: 3306,
    user: 'spainspain',
    password: 'spainspain',
    database: 'spain'
  });

  try {
    console.log('🔍 Получаем список активных подключений...');
    
    const [processes] = await connection.query('SHOW PROCESSLIST');
    
    console.log(`📊 Всего активных подключений: ${processes.length}`);
    
    // Фильтруем только подключения от нашего пользователя (кроме текущего)
    const currentId = connection.threadId;
    const toKill = processes.filter(p => 
      p.User === 'spainspain' && 
      p.Id !== currentId &&
      p.Time > 60 // старше 60 секунд
    );
    
    console.log(`🎯 Найдено зависших подключений: ${toKill.length}`);
    
    if (toKill.length === 0) {
      console.log('✅ Зависших подключений не найдено!');
      return;
    }
    
    // Убиваем зависшие подключения
    for (const process of toKill) {
      try {
        await connection.query(`KILL ${process.Id}`);
        console.log(`❌ Убито подключение #${process.Id} (время: ${process.Time}s, команда: ${process.Command})`);
      } catch (err) {
        console.log(`⚠️  Не удалось убить подключение #${process.Id}: ${err.message}`);
      }
    }
    
    console.log('✅ Очистка завершена!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await connection.end();
  }
}

clearConnections().catch(console.error);
