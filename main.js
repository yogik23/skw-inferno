const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');
const figlet = require('figlet');
const displayWelcomeMessage = require('./welcomeMessage');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const models = JSON.parse(fs.readFileSync('models.json', 'utf8'));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
        console.log(chalk.blue.bold('Semua Quest:'));
        response.data.forEach(quest => {
            const target = quest.extData && quest.extData.target ? quest.extData.target : 'N/A';
            console.log(chalk.blue(`- ID ${quest.id} ${quest.description}`));
        });
        return response.data;
    } catch (error) {
        console.error(chalk.red('Kesalahan Mengambil Quest:', error.response ? error.response.data : error.message));
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
                return 'sudah_diklaim';
            } else {
            }
        } else {
            console.error(chalk.red('Kesalahan Mengklaim Quest:', error.message));
        }
    }
};


async function runModel(model, inputText, token, id) {
    const url = 'https://api.inferium.io/inf-v1/v1/models/query';
    const payload = { model, inputText, id };

    try {
        const response = await axios.post(url, payload, { headers: HEADERS(token) });
        console.log(chalk.green(`Model ${model} berhasil dijalankan dengan input "${inputText}".`));
        return response.data;
    } catch (error) {
        const errorMessage = error.response ? 
            (error.response.data ? JSON.stringify(error.response.data, null, 2) : error.message) : 
            error.message;
        
        console.error(chalk.red(`Error saat menjalankan model ${model}:`, errorMessage));
    }
}


const claimAllQuests = async (quests, account, token) => {
    for (const quest of quests) {
        const socialId = quest.extData && quest.extData.target ? quest.extData.target : null;
        const action = quest.action;
        const type = quest.type;
        const activityId = quest.id;
        const description = quest.description;

        if (quest.isAchieved) {
            console.log(chalk.green(`Quest ID ${activityId} sudah diklaim.`));
        } else {
            const result = await doQuest(socialId, action, type, token);
            await delay(2000);

            const claimResult = await claimQuest(activityId, account, token);
            if (claimResult && claimResult !== 'sudah_diklaim') {
                console.log(chalk.green(`Quest ID ${activityId} berhasil diklaim.`));
            } else {
                console.log(chalk.red(`Quest ID ${activityId} Lakukan Manual`));
            }
        }

        await delay(2000);
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

            const quests = await getAllQuests(token);
            console.log(chalk.grey('Mengerjakan quest RUN 10 MODELS .....'));

            for (const [model, inputTextArray] of Object.entries(models)) {
                const inputIndex = Math.floor(Math.random() * inputTextArray.length);
                const inputTextForModel = inputTextArray[inputIndex];

                if (inputTextForModel) {
                    await runModel(model, inputTextForModel, token, Date.now());
                    await delay(2000);
                } else {
                    console.error(chalk.yellow(`InputText untuk model ${model} tidak ditemukan.`))
                }
            }

            console.log(chalk.grey('Claim Quest.....'));
            await claimAllQuests(quests, email, token);
            console.log(chalk.grey(''));
            }
        }
    } 
}  


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
        process.stdout.write(chalk.magenta(`Cooldown Claim Berikutnya: ${countdown} detik. Bot By SKW AIRDROP HUNTER`));
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
