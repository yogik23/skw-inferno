const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');
const figlet = require('figlet');
const displayWelcomeMessage = require('./welcomeMessage');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const HEADERS = (token) => ({
    'Accept': 'application/json, text/plain, */*',
    'Authorization': token ? `Bearer ${token}` : undefined,
    'Content-Type': 'application/json',
    'Origin': 'https://www.inferium.io',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
});

const loginUser = async (email, password) => {
    const url = 'https://api.inferium.io/inf-v1/v1/users/login';
    try {
        const response = await axios.post(url, { email, password, type: 'EMAIL' }, { headers: HEADERS() });
        console.log(chalk.magenta.bold('Akun :', response.data.email));
        return response.data.token;
    } catch (error) {
        console.error(chalk.red('Login Error:', error.response ? error.response.data : error.message));
    }
};

const getUserActivity = async (token) => {
    const url = 'https://api.inferium.io/inf-v1/v1/users/activity/daily';
    try {
        const response = await axios.get(url, { headers: HEADERS(token) });
        return response.data;
    } catch (error) {
        console.error(chalk.red('Activity Error:', error.response ? error.response.data : error.message));
    }
};

const claimReward = async (activityId, account, token) => {
    const url = 'https://api.inferium.io/inf-v1/v1/users/activity';
    const payload = { activityId, account, extData: {} };

    try {
        const response = await axios.post(url, payload, { headers: HEADERS(token) });
        console.log(chalk.green('Daily Login Sukses'));
    } catch (error) {
        if (error.response && error.response.data.errorCode === 'BAD_REQUEST') {
            console.log(chalk.yellow('Sudah klaim daily.'));
        } else {
            console.error(chalk.red('Claim Reward Error:', error.response ? error.response.data : error.message));
        }
    }
};

const getAllQuests = async (token) => {
    const url = 'https://api.inferium.io/inf-v1/v1/challenge/all';
    try {
        const response = await axios.get(url, { headers: HEADERS(token) });
        console.log(chalk.blue.bold('All Quests:'));
        response.data.forEach(quest => {
            const target = quest.extData && quest.extData.target ? quest.extData.target : 'N/A';
            console.log(chalk.blue(`- ID ${quest.id} ${quest.description}`));
        });
        return response.data;
    } catch (error) {
        console.error(chalk.red('Get Quests Error:', error.response ? error.response.data : error.message));
    }
};

const doQuest = async (socialId, action, type, token) => {
    const url = `https://api.inferium.io/inf-v1/v1/social/check-status?socialId=${socialId}&action=${action}&platform=${type}`;
    try {
        const response = await axios.get(url, { headers: HEADERS(token) });
        return response.data;
    } catch (error) {
    }
};

const claimQuest = async (activityId, account, token) => {
    const url = 'https://api.inferium.io/inf-v1/v1/challenge/claim';
    const payload = { activityId, account, extData: {} };

    try {
        const response = await axios.post(url, payload, { headers: HEADERS(token) });
        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.data.errorCode === 'INVALID_ARGUMENT') {
                return 'already_claimed';
            } else {
                console.error(chalk.red('Claim Quest Error:', error.response.data));
            }
        } else {
            console.error(chalk.red('Claim Quest Error:', error.message));
        }
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const claimAllQuests = async (quests, account, token) => {
    for (const quest of quests) {
        const socialId = quest.extData && quest.extData.target ? quest.extData.target : null;
        const action = quest.action;
        const type = quest.type;
        const activityId = quest.id;
        const description = quest.description;

        
        const questResult = await doQuest(socialId, action, type, token);
        await delay(2000);

        if (questResult === true) {
            const claimResponse = await claimQuest(activityId, account, token);
            if (claimResponse === 'already_claimed') {
                console.log(chalk.green('- Quest sudah diclaim.'));
            } else if (claimResponse && claimResponse.status === 'CLAIMED') {
                console.log(chalk.green(`- Berhasil Mengerjakan quest ${description}`));
            } else {
                console.log(chalk.red(`- Gagal mengerjakan quest ${description}... Kerjakan Manual atau Belum Connect Sosmed`));
            }
        } else {
            console.log(chalk.red(`- Gagal mengerjakan quest ${description}... Kerjakan Manual atau Belum Connect Sosmed`));
        }

        await delay(3000);
    }
};

async function startBot() {
    const accounts = JSON.parse(fs.readFileSync('config.json', 'utf8'));

    for (const { email, password } of accounts) {
        const token = await loginUser(email, password);

        if (token) {
            const activities = await getUserActivity(token);

            if (activities && activities.length > 0) {
                const activityId = activities[0].id;
                await claimReward(activityId, email, token);
            }

            const quests = await getAllQuests(token);

            console.log(chalk.grey('Mengerjakan quest.....'));
            await claimAllQuests(quests, email, token);
            console.log(chalk.grey(''));
        }
    }
};



async function main() {
  console.clear();
  const intervalTime = (24 * 60 * 60 * 1000);

  const runBot = async () => {
    displayWelcomeMessage();
    await startBot();
    startCountdown();
  };

  const startCountdown = () => {
    let countdown = intervalTime / 1000;

    const countdownInterval = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        console.log(chalk.red('Waktu habis, menjalankan bot kembali...\n'));
      } else {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(chalk.magenta(`Cooldown Claim Berikutnya: ${countdown} detik. Bot By skwairdrop`));
        countdown--;
      }
    }, 1000);
  };

  await runBot();

  setInterval(runBot, intervalTime);
}

if (require.main === module) {
  main();
}
