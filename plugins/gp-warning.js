let war = global.maxwarn
let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
  else who = m.chat
  if (!who) throw `✳️ اعمل منشن للشخص\n\n📌 مثال : ${usedPrefix + command} @user`
  if (!(who in global.db.data.users)) throw `✳️ لم يتم العثور على المستخدم في قاعدة البيانات الخاصة بي`
  let name = conn.getName(m.sender)
  let warn = global.db.data.users[who].warn
  if (warn < war) {
    global.db.data.users[who].warn += 1
    m.reply(
      `
⚠️ *تم اعطاء العضو انذار* ⚠️

▢ *الادمن:* ${name}
▢ *العضو:* @${who.split`@`[0]}
▢ *الانذارات:* ${warn + 1}/${war}
▢ *السبب:* ${text}`,
      null,
      { mentions: [who] }
    )
    m.reply(
      `
⚠️ *انذار* ⚠️
لقد تلقيت تحذيرًا من أحد المشرفين

▢ *الانذارات:* ${warn + 1}/${war} 
إذا تلقيت *${war}* انذارات سيتم إزالتك تلقائيا من المجموعة`,
      who
    )
  } else if (warn == war) {
    global.db.data.users[who].warn = 0
    m.reply(`*⛔ تجاوز العضو ${war} انذارات سيتم طرده بنعالي*`)
    await time(3000)
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
    m.reply(
      `♻️ لقد تمت إزالتك من المجموعة *${groupMetadata.subject}* لأنه تم تحذيرك *${war}* مرات`,
      who
    )
  }
}
handler.help = ['warn @user']
handler.tags = ['group']
handler.command = ['انذار']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const time = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
