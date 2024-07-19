let handler = async (m, { conn, args, groupMetadata }) => {
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
  else who = m.chat
  if (!who) throw `✳️ اعمل منشن لي الشخص`
  if (!(who in global.db.data.users)) throw `✳️ لم يتم العثور على المستخدم في قاعدة البيانات الخاصة بي`
  let warn = global.db.data.users[who].warn
  if (warn > 0) {
    global.db.data.users[who].warn -= 1
    m.reply(`⚠️ *DELWARN*
         
▢ Warns: *-1*
▢ Warns total: *${warn - 1}*`)
    m.reply(`✳️ تم ازالة الانذار بنجاح *${warn - 1}*`, who)
  } else if (warn == 0) {
    m.reply('✳️ المستخدم ليس لديه انذارات')
  }
}
handler.help = ['delwarn @user']
handler.tags = ['group']
handler.command = ['رفع_الانذار', 'unwarn']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
