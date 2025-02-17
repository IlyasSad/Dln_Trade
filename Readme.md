# Blockchain Transaction Script

Этот скрипт предназначен для работы с блокчейн-транзакциями на Ethereum-совместимых сетях с использованием API DLN (Decentralized Liquidity Network).

## Описание

Скрипт включает в себя функции для получения котировок транзакций, создания транзакционных заказов и их отправки в сеть блокчейн. Все функции используют библиотеку `ethers.js` для взаимодействия с Ethereum блокчейном и `axios` для HTTP-запросов.

### Функции

- `getQuote(params: QuoteParams)`: Получение котировки для транзакции. Параметры включают идентификаторы исходной и целевой блокчейн-сетей, а также данные о токенах.
- `createOrderTx(params: OrderTxParams)`: Создание данных для транзакции на основе полученной котировки.
- `sendTransaction(txData: any)`: Отправка подписанной транзакции в блокчейн.

### Настройка и использование

1. **Настройка .env файла**
   Для работы скрипта необходимо настроить переменные среды в файле `.env`, который должен содержать следующие параметры:

   ```plaintext
   ALICE_PRIVATE_KEY=ваш_личный_ключ
```npm install axios ethers dotenv```
