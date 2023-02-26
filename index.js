const fs = require("fs")
const { converter } = require('./system/index.js').default;

let count = 0;


async function start () {
let veri = await fs.readdirSync('./commands')
let files_count = veri.length;
console.log('[LOG] Convert operation started.')
fs.readdirSync('./commands').forEach(async dir => {
    try {
    let commandFiles;
    let is_main_file = false;
    if(dir.includes('.')) {
    if(dir.includes('.js')) {
     is_main_file = true;
     commandFiles = await fs.readFileSync(`./commands/${dir}`) 
    }
    } else {
    commandFiles = await fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
    }
    for (const file of commandFiles) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        count = count + 1;
        if(count > veri.length) {
        count = count + 1
        console.log('\n\n|-----------------------------|')
        console.log('| PROCESS COMPLETED SUCCESSFULLY! |')
        console.log('| --------------------------- |')
        console.log('|  Now your "' + files_count + '" code is V13!  |')
        console.log('|-----------------------------|')
        process.exit(5)
        } else {
        if(file.length && file.includes('.js')) {
        files_count = files_count + 1;
        console.log('[INFO] Code converting: ' + file)
        count = 0
        }
        }
        var code;
        if(is_main_file) {
        code = await fs.readFileSync(`./commands/${dir}`, { encoding: 'utf8', flag: 'r' });
        } else {
        code = await fs.readFileSync(`./commands/${dir}/${file}`, { encoding: 'utf8', flag: 'r' });
        }
     
       let newData = await converter(code, false);

        try {
            if(is_main_file) {
            fs.writeFileSync(`./commandsV13/${dir}`, newData.code)
            } else {
            fs.writeFileSync(`./commandsV13/${dir}/${file}`, newData.code)
            }
        } catch(e) {
            console.log(e)
            if(is_main_file) {
            fs.mkdirSync(`./commandsV13/${dir}`, {
                recursive: true
            });
            fs.writeFileSync(`./commandsV13/${dir}`, newData.code)
            } else {
            fs.mkdirSync(`./commandsV13/${dir}`, {
                recursive: true
            });
            fs.writeFileSync(`./commandsV13/${dir}/${file}`, newData.code)
            }
        }
    }
    } catch (e) {
    console.log(e)
    }
})
}
start();
