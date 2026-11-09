const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'src');
const js=fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort().map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n');
const html=fs.readFileSync(path.join(__dirname,'shell.html'),'utf8').replace('/*__GAME__*/',()=>js);
fs.mkdirSync(path.join(__dirname,'dist'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'dist','index.html'),html);
console.log('built',html.length,'bytes');
