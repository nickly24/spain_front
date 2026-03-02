-- Скрипт для очистки зависших подключений MySQL
-- Использование: npx prisma db execute --file scripts/kill-connections.sql --schema prisma/schema.prisma

-- Показать все подключения
SELECT 
    Id,
    User,
    Host,
    db,
    Command,
    Time,
    State,
    Info
FROM information_schema.PROCESSLIST
WHERE User = 'spainspain'
  AND Time > 60
ORDER BY Time DESC;

-- Для убийства подключений нужно выполнить вручную:
-- KILL <process_id>;
