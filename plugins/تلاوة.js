import { generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys';
import axios from 'axios';

const handler = async (m, { conn, text, command }) => {
    const device = getDevice();

    const availableSurahs = [
        "الفاتحة", "البقرة", "ال عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
        "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء",
        "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان",
        "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف",
        "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر",
        "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن",
        "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة",
        "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الإنفطار", "المطففين", "الإنشقاق", "البروج",
        "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق",
        "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون",
        "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
    ];

    if (command === 'سوره') {
        if (!text) {
            throw `⎔ ⋅ ───━ •﹝👑﹞• ━─── ⋅ ⎔\nما السوره التي تبحث عنها\n*يرجى إدخال رقم السورة*\n\n*مثال*:\n.سوره الفاتحة\n❐━═⏣⊰𝐁𝐘:𝐍𝐀𝐑𝐎𝐓𝐔⊰👑⊱𝐁𝐎𝐓⊱⏣═━❐*\n> الامر يجعل البوت يعيد تشغيل البوت او لا يرسل الصوت لو كانت السوره كبيره`;
        }

        const surahName = text.trim();

        if (!availableSurahs.includes(surahName)) {
            const surahList = availableSurahs.join('\n');
            throw `السورة "${surahName}" غير موجودة. يرجى اختيار سورة من القائمة التالية:\n\n${surahList}`;
        }

        const response = await axios.get(`https://api-me-4ef1b6491458.herokuapp.com/api/surah2?number=${surahName}`);
        const { data } = response;

        const { recitations, verses } = data;

        const recitationsLinks = {};
        recitations.forEach(recitation => {
            recitationsLinks[recitation.name] = recitation.audioUrl;
        });

        const messageBody = verses.map((verse, index) => `${index + 1}. ${verse}`).join('\n');
        
        const recitationOptions = recitations.map(recitation => ({
            header: recitation.name,
            title: '',
            description: 'اضغط للاستماع',
            id: `.تلاوة ${recitationsLinks[recitation.name]}`
        }));

        const zoro = {
            body: { text: `اتفضل السوره\n\n${messageBody}`.trim() },
            footer: { text: `${global.wm}`.trim() },  
            header: {
                title: `*${surahName}*`,
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: 'قائمة الاصوات',
                            sections: [{
                                title: 'التلاوات',
                                rows: recitationOptions
                            }]
                        })
                    }
                ],
                messageParamsJson: ''
            }
        };

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: zoro,
                },
            },
        }, { userJid: conn.user.jid, quoted: m });

        conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });      
        
    } else if (command === 'تلاوة') {
        if (!text) {
            throw 'يرجى تقديم رابط الصوت';
        }

        const doc = {
            audio: {
                url: text,
            },
            mimetype: 'audio/mpeg',
            ptt: true,
            waveform: [100, 0, 100, 0, 100, 0, 100],
            fileName: 'surah.mp3',
        };

        await conn.sendMessage(m.chat, doc);
    }
};

handler.help = ['Elsonysurah <surah>'];
handler.tags = ['Elsonysurah'];
handler.command = ['سوره', 'تلاوة'];

export default handler;
