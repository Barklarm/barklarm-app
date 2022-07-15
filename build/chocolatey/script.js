const fs = require('fs').promises;
const path = require('path');
var crypto = require('crypto');
const packageJson = require('../../package.json')

// Below statements must be wrapped inside the 'async' function:

const replaceInFile = async (file, pattern, value) => {
    const data = await fs.readFile(file,'utf-8');
    const result = data.replace(pattern, value);
    await fs.writeFile(file, result,'utf-8');
};

const calculateChecksum = async (file) => {
    const data = await fs.readFile(file);
    return crypto
        .createHash('md5')
        .update(data)
        .digest('hex');
}

const updateInstallScript = async () => {
    const checksum = await calculateChecksum(path.join(__dirname,'..','..', 'out','make','squirrel.windows','x64',`barklarm-${packageJson.version} Setup.exe`))
    await replaceInFile(path.join(__dirname, 'chocolateyinstall copy.ps1'), /__REPLACE_VERSION__/g,packageJson.version);
    await replaceInFile(path.join(__dirname, 'chocolateyinstall copy.ps1'), /__REPLACE_CHECKSUM__/g, checksum);
};

const updateNuspec = async () => {
    await replaceInFile(path.join(__dirname, 'barklarm copy.nuspec'), /__REPLACE_VERSION__/g,packageJson.version);
};

console.log("update Install Script: started")
updateInstallScript()
    .then(() => console.log("update Install Script: ok"))
    .catch((e) => console.error("update Install Script: error", e))

console.log("update nuspec: started")
updateNuspec()
    .then(() => console.log("update nuspec: ok"))
    .catch((e) => console.error("update nuspec: error", e))
