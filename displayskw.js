const chalk = require('chalk');

const welcomeskw = `
   ███████╗██╗  ██╗██╗    ██╗
   ██╔════╝██║ ██╔╝██║    ██║
   ███████╗█████╔╝ ██║ █╗ ██║
   ╚════██║██╔═██╗ ██║███╗██║
   ███████║██║  ██╗╚███╔███╔╝
   ╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ 
                          
`;

function displayskw() {
  console.log(welcomeskw);
  console.log(chalk.hex('#ffb347')(`Fitur Autobot by SKW AIRDROP HUNTER`));
  console.log(chalk.hex('#90ee90')('1. Multi Akun'));
  console.log(chalk.hex('#90ee90')('2. Menyelesaikan Quest'));
  console.log(chalk.hex('#90ee90')('3. Daily Check in dan Daily Quest'));
  console.log(chalk.hex('#90ee90')('4. Bisa Register Akun'));
  console.log(chalk.hex('#90ee90')('5. Otomatis mengulang Autobot dijam 8 Pagi WIB'));
}

module.exports = displayskw;
