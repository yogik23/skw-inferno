const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');

const users = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const HEADERS = (token) => ({
    'Accept': 'application/json, text/plain, */*',
    'Authorization': token ? `Bearer ${token}` : undefined,
    'Content-Type': 'application/json',
    'Origin': 'https://www.inferium.io',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
});

const saveUserData = (email, password) => {
    const userData = { email, password };
    const filePath = 'config.json';

    if (fs.existsSync(filePath)) {
        const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        existingData.push(userData);
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    } else {
        fs.writeFileSync(filePath, JSON.stringify([userData], null, 2));
    }
};

const registerUsers = async () => {
    const url = 'https://api.inferium.io/inf-v1/v1/users/register-email';

    for (const user of users) {
        const payload = {
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword,
            code: user.code,
            inviteCode: user.inviteCode
        };

        try {
            const response = await axios.post(url, payload, { headers: HEADERS() });

            console.log(chalk.green(`Registrasi berhasil untuk ${user.email}!`));

            saveUserData(user.email, user.password);
            console.log('Data pengguna telah disimpan.');
        } catch (error) {
            if (error.response) {
                console.error(chalk.red(`Registrasi gagal untuk ${user.email}. Status code:`, error.response.status));
                console.error('Pesan:', error.response.data);
            } else {
                console.error(chalk.red(`Terjadi kesalahan untuk ${user.email}:`, error.message));
            }
        }
    }
};

registerUsers();
