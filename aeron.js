const respon = require('./lib/respon.js');
const { downloadContentFromMessage, toBuffer, generateWAMessageFromContent, proto } = require('@adiwajshing/baileys');
const Crypto = require("crypto")
const colors = require('colors/safe');
const fs = require('fs');
const chalkanim = require('chalk-animation');
const moment = require("moment-timezone");
const { spawn } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')
const path = require("path")
const { fetch, downloadSaveImgMsg } = require('./lib/anu.js');
const session = require('./session.json');
moment.tz.setDefault('Asia/Jakarta').locale("id");


const list = "⇝";


module.exports = hehe = async (aeron, msg) => {
try {
const type = Object.keys(msg.message)[0];
const body = (type === 'conversation') ? msg.message.conversation : (type == 'imageMessage') ? msg.message.imageMessage.caption : (type == 'videoMessage') ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId || msg.text) : ''
const prefix = /^[./~!#%^&=\,;:()z]/.test(body) ? body.match(/^[./~!#%^&=\,;:()z]/gi) : '#';
const isCommand = body.startsWith(prefix);
const cmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const time = moment(new Date()).format("HH:mm");
const text = msg.message.conversation;
const isGroup = msg.key.remoteJid.endsWith('@g.us');
const from = msg.key.remoteJid;
const content = JSON.stringify(msg.message);
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const botNumber = aeron.user.id.split(':')[0] + '@s.whatsapp.net';
const botName = aeron.user.name;
const pushname = msg.pushName;
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid;
const groupMetadata = isGroup ? await aeron.groupMetadata(from) : '';
const uwong = isGroup ? await groupMetadata.participants : '';
const groupAdmins = isGroup ? await uwong.filter(v => v.admin !== null).map(a => a.id) : '';
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
const isGroupAdmins = groupAdmins.includes(sender) || false;
const groupName = isGroup ? groupMetadata.subject : "";

const isMedia = (type === 'imageMessage' || type === 'videoMessage');
const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage');
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage');
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage');
await aeron.sendReadReceipt(from, msg.key.participant, [msg.key.id]);


if (isGroup && isCommand) {
console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(cmd) + " " + colors.green("from") + " " + colors.blue(groupName));
} else if (!isGroup && isCommand) {
console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(cmd) + " " + colors.green("from") + " " + colors.blue(pushname));
}

const reply = (teksnya) => {
aeron.sendMessage(from, { text: teksnya },{ quoted: msg});
};

switch (cmd) {

case 's':
case 'sticker':
case 'stiker':
case 'sgif':
case 'stickergif':
case 'stikergif':
try {
reply("_Sedang di prosess..._")
if (isMedia || isQuotedImage) {
var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
var buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
fs.writeFileSync('./rubbish/res_buffer.jpg', buffer)
const image = './rubbish/res_buffer.jpg'
await ffmpeg(image)
.input(image)
.on('start', function (start) {
 console.log(colors.green.bold(`${start}`))
})
.on('error', function (error) {
reply("error")
 console.log(`${error}`)
})
.on('end', function () {
console.log(colors.yellow('Selesai convert'))
aeron.sendMessage(from, { sticker: {url: './rubbish/mysticker.webp'}, mimetype: 'image/webp' })
})
.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
.toFormat('webp')
.save('./rubbish/mysticker.webp')
} else if (isMedia || isQuotedVideo) {
var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
var buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
fs.writeFileSync('./rubbish/res_buffer.mp4', buffer)
const video = './rubbish/res_buffer.mp4'
await ffmpeg(video)
.input(video)
.on('start', function (start) {
 console.log(colors.green.bold(`${start}`))
})
.on('error', function (error) {
reply("error")
 console.log(`${error}`)
})
.on('end', function () {
console.log(colors.yellow('Selesai convert'))
aeron.sendMessage(from, { sticker: {url: './rubbish/mysticker2.webp' }, mimetype: 'image/webp' })
})
.addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
.toFormat('webp')
.save('./rubbish/mysticker2.webp')
} else {
reply('_Kirim gambar/video dengan caption !sticker/ reply gambar/video dengan perintah !sticker_ ')
}
} catch (e) {
console.log(colors.red(e))
reply("_Maaf error, coba lagi dengan reply gambar/video dengan caption !sticker, *jika tetap terjadi lapor ke bot*_")
}
break
case 'covid':
case 'corona':
if (!q) return reply("_Masukan negara contoh: !covid Indonesia_")
const anu = await fetch(`https://covid19.mathdro.id/api/countries/${q}`)
reply(`*Confirmed:* ${anu.confirmed.value}\n*Recovered:* ${anu.recovered.value}\n*Deaths:* ${anu.deaths.value}\n*Last Update:* ${anu.lastUpdate}`)
break
case 'wpml':
case 'wallml':
case 'wallpaperml':
case 'wallpapermobilelegends':
aeron.sendMessage(from, { image: { url: "https://r1ynz.herokuapp.com/docs/wpml" }, mimetype: 'image/jpeg', jpegThumbnail: false }, { quoted: msg, });
break
case 'editinfo':
case 'editinfogroup':
case 'editinfogrup':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));

if (args[0] === 'all') {
await aeron.groupSettingUpdate(from, 'unlocked')
} else if (args[0] === 'admin') {
await aeron.groupSettingUpdate(from, 'locked')
} else {
const buttons = [
  {buttonId: '!editinfo admin', buttonText: {displayText: 'Only admin'}, type: 1},
  {buttonId: '!editinfo all', buttonText: {displayText: 'All members'}, type: 1},
]
const buttonMessage = {
    text: "Klik Only admin untuk mengizinkan edit grup hanya admin, Klik All members untuk mengizinkan edit group untuk semua peserta group",
    footer: '',
    buttons: buttons,
    headerType: 1
}
const sendMsg = await aeron.sendMessage(from, buttonMessage)
}
break
case 'group':
case 'grup':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));

if (args[0] === 'close') {
await aeron.groupSettingUpdate(from, 'announcement')
} else if (args[0] === 'open') {
await aeron.groupSettingUpdate(from, 'not_announcement')
} else {
const buttons = [
  {buttonId: '!group open', buttonText: {displayText: 'Open'}, type: 1},
  {buttonId: '!group close', buttonText: {displayText: 'Close'}, type: 1},
]

const buttonMessage = {
    text: "Klik open untuk membuka group, Klik close untuk menutup group\n\n Klik Only admin untuk mengizinkan edit grup hanya admin, Klik All members untuk mengizinkan edit group untuk semua peserta group",
    footer: '',
    buttons: buttons,
    headerType: 1
}

const sendMsg = await aeron.sendMessage(from, buttonMessage)

}
break
case 'hidetag':
if (!q) return reply(respon.notText(prefix,cmd, pushname));
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
const id = uwong.map(v => v.id)
aeron.sendMessage(from, { text: `${q}`, mentions: id })
break
case 'promote':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return reply('Tag orang yang ingin dipromosikan menjadi admin group');
const men = msg.message.extendedTextMessage.contextInfo.mentionedJid;
aeron.groupParticipantsUpdate(from, men,"promote");
break
case 'demote':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return reply('Tag orang yang ingin di demote di group ini');
const mention = msg.message.extendedTextMessage.contextInfo.mentionedJid;
await aeron.groupParticipantsUpdate(from, mention,"demote");
break
case 'add':
try {
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (!q) return reply("Masukan nomor yang ingin ditambahkan di group\nex: !add 62881xxxxxxx")
nomor = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
await aeron.groupParticipantsUpdate(from, [nomor],"add")
} catch (e) {
reply('Maaf error')
}
break
case 'kick':
try {
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return reply('Tag orang yang ingin dikeluarkan dari group ini')
const mention = msg.message.extendedTextMessage.contextInfo.mentionedJid
await aeron.groupParticipantsUpdate(from, mention,"remove")
} catch (e) {
reply('Maaf error')
}
break

case 'resetlink':
case 'revoke':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
await aeron.groupRevokeInvite(from)
break
case 'linkgroup':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
const code = await aeron.groupInviteCode(from)
reply("https://chat.whatsapp.com/" + code)
break
case 'setdesc':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (!q) return reply(respon.notText(prefix,cmd, pushname));
sock.groupUpdateDescription(from, q)
break
case 'setname':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (!q) return reply(respon.notText(prefix,cmd, pushname));
aeron.groupUpdateSubject(from, q);
break
case 'owner':
const vcard = 'BEGIN:VCARD\n'
+ 'VERSION:3.0\n' 
+ 'FN:ԾЩ刀乇尺\n'
+ 'TEL;type=CELL;type=VOICE;waid=6285217234457:+62 852 1723 4457\n'
+ 'END:VCARD';
const sentMsg  = await aeron.sendMessage(from, { contacts: { contacts: [{ vcard }] }});
break
case 'donasi':
case 'donate':
const donasi =`*
Kami tidak meminta donasi, Silahkan gunakan bot ini dengan bijak!*
`
reply(donasi)
break
case 'help':
case 'menu':
const menu = `
Halo ${pushname}


*⛦ Maker menu*
${list} ${prefix}sticker
${list} ${prefix}sgif

*⛦ Wallpaper menu*
${list} ${prefix}wpml

*⛦ Group menu*
${list} ${prefix}group open/close
${list} ${prefix}editinfogroup admin/all
${list} ${prefix}hidetag
${list} ${prefix}add
${list} ${prefix}kick
${list} ${prefix}promote
${list} ${prefix}demote
${list} ${prefix}resetlink
${list} ${prefix}linkgroup
${list} ${prefix}setname
${list} ${prefix}setdesc
`
const buttons = [
  {buttonId: '!donasi', buttonText: {displayText: 'Donasi'}, type: 1},
  {buttonId: '!owner', buttonText: {displayText: 'Owner'}, type: 1},
]

const buttonMessage = {
    image: { url: './thumbnail/menu.jpg' },
    caption: menu,
    footer: 'https://youtube.com/c/R1ynz',
    buttons: buttons,
    headerType: 4
}

await aeron.sendMessage(from, buttonMessage, { quoted: msg})
break

default: 
}
} catch (e) {
console.log(`${e}`)
}
}
