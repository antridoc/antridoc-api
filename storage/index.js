const fs = require('fs');
const path = require('path');

const directory = __dirname;
const params = process.argv

export function clear(all = false) {
    const dir = path.join(directory, '/tmp')
    fs.readdir(dir, (err, files) => {
        if (err) console.error(err);
        for (const file of files) {
            fs.unlinkSync(path.join(dir, file));
        }
    });
}

if (params.includes("--clear")) {
    clear()
}

