export default async function handler(req, res) {
    // Разрешаем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, phone, contact, items, total } = req.body;

        // Проверяем обязательные поля
        if (!name || !phone || !contact || !items || !total) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        // Получаем данные бота из переменных окружения
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_IDS = process.env.TELEGRAM_CHAT_ID;

        if (!BOT_TOKEN || !CHAT_IDS) {
            console.error('Telegram credentials not configured');
            return res.status(500).json({ error: 'Сервер не настроен' });
        }

        // Разделяем Chat IDs (могут быть через запятую)
        const chatIdList = CHAT_IDS.split(',').map(id => id.trim());

        // Формируем сообщение
        const message = `
🔔 *НОВЫЙ ЗАКАЗ*

👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
💬 *Контакт:* ${contact}

📚 *Книги:*
${items.map(item => `  • ${item}`).join('\n')}

💰 *Итого:* ${total}
        `.trim();

        // Отправляем сообщение во все чаты
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const sendPromises = chatIdList.map(chatId => 
            fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown',
                }),
            }).then(res => res.json())
        );

        const results = await Promise.all(sendPromises);

        // Проверяем, что хотя бы одно сообщение отправлено успешно
        const hasSuccess = results.some(data => data.ok);
        const allFailed = results.every(data => !data.ok);

        if (allFailed) {
            console.error('All Telegram sends failed:', results);
            return res.status(500).json({ error: 'Ошибка отправки в Telegram' });
        }

        return res.status(200).json({ success: true, message: 'Заказ отправлен!' });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
}
