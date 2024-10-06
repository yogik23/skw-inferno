const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');

const users = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const HEADERS = () => ({
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Origin': 'https://www.inferium.io',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
});

const sendEmailCode = async (email) => {
    const url = 'https://api.inferium.io/inf-v1/v1/authentication/email/send-code';

    try {
        const response = await axios.post(url, 
            { email: email }, 
            {
                headers: HEADERS(),
            }
        );

        console.log(chalk.green(`Kode email dikirim ke ${email}. Ambil dan submit di data.json, kode kadaluwarsa 10 menit.`));
    } catch (error) {
        console.error(chalk.red(`Error mengirim ke ${email}:`, error.response ? error.response.data : error.message));
    }
};

(async () => {
    for (const user of users) {
        await sendEmailCode(user.email);
    }
})();
