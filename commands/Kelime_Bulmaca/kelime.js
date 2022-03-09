const Discord = require('discord.js');
const fs = require('fs');
const settings_path = 'batuhandb/kelime_bulmaca/settings.json';
const request = require('request');
module.exports = {
	name: 'kelime',
	description: 'Melodia Kelime Oyunu',
	execute(message, args) {
		if(!args[0])return;
        var settings_channels = global.fullarr.channels;
        var settings_game_bool = global.fullarr.game_bool;
        let kanal_index = settings_channels.findIndex(find => find.guild_id === message.guild.id);
        let game_bool_index = settings_game_bool.findIndex(find => find.guild_id === message.guild.id);
        let game_bool_value = settings_game_bool[game_bool_index].game_bool;
        if(!settings_channels[kanal_index].channel_id){
            if(!message.member.hasPermission('KICK_MEMBERS')){
                message.reply('Komutu kullanmak için yeterli yetkiye sahip değilsiniz gereken yetki **YÖNETİCİ** sıkıyosa ver knk.').then(msg => msg.delete({timeout:5000}));
                message.delete({timeout:5000});
                return;
            }
            let mention_kanal = message.mentions.channels.first();
            let son_kelime_index = global.fullarr.son_kelime.findIndex(find => find.guild_id === message.guild.id);
            let sonharf = message.content.length;
            let stngssonharf = global.fullarr.son_kelime[son_kelime_index].son_harf;
            if(mention_kanal){
                settings_channels[kanal_index].channel_id = mention_kanal.id;
                const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL(),"")
                .setDescription(`İşlem başarılı yetkili <@${message.author.id}> tarafından kuruldu oyun aktif edildi, kurulum otomatik yapıldı.\n \n**Ayarlanan kanal:** ${mention_kanal} \n**Başlangıç Harfi:** \`${stngssonharf}\` \n \nBaşlangıç Harfi kısmı bozuk değildir acemi çalışmıyoruz. Ücretsiz bir şekilde paylaştık çünkü bazıları bunu satıyor ama haketmiyor :D`)
                .setFooter('Melodia Winter Time', 'https://images-ext-1.discordapp.net/external/or91-CeO1iGyvc4DmyIoXD22H7TApAOhiJL7zmVKZek/https/cdn.discordapp.com/icons/890256161046134835/f0ae1930d42712006c1c6d974cbb224e.webp')
                .setTimestamp()
                .setColor("GREEN");
                message.channel.send(embed);
                fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                    if (err) throw err;
                });
                return;
            }
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL(),"")
                .setDescription('Kelime oyunu fonksiyonları için bir kanal ayarlanmalısınız aşağıda nasıl ayarlayacağınızı gösterdik.\nAyarlamak için **!kelime kanal #kanal**')
                .setColor("GREEN");
            message.channel.send(embed);
            return;
        }
        switch (args[0]) {
            case 'kanal':
                if(!message.member.hasPermission('ADMINISTRATOR')){
                    message.reply('Bu komutu kullanamazsınız.').then(msg => msg.delete({timeout:5000}));
                    message.delete({timeout:5000});
                    return;
                }
                if(settings_channels[kanal_index].channel_id && !args[1]){
                    let available_channel = message.guild.channels.cache.get(settings_channels[kanal_index].channel_id);
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL(),"")
                        .addField('Kelime kanalı ayarlı', available_channel)
                        .setFooter('Ayarlı kanalı değiştirmek için **!kelime kanal #kanal** komutunu kullanabilirsiniz.')
                        .setColor("GREEN");
                    message.channel.send(embed);
                    return;
                }
                if(settings_channels[kanal_index].channel_id && args[1]){
                    let mention_kanal = message.mentions.channels.first();
                    if(!mention_kanal){
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL(),"")
                            .setDescription('Komut kullanımı: **!kelime kanal #kanal**')
                            .setColor("GREEN");
                        message.channel.send(embed);
                        return;
                    }
                    settings_channels[kanal_index].channel_id = mention_kanal.id;
                    let son_kelime_index = global.fullarr.son_kelime.findIndex(find => find.guild_id === message.guild.id);
                    let sonharf = message.content.length;
                    let stngssonharf = global.fullarr.son_kelime[son_kelime_index].son_harf;
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL(),"")
                        .setDescription(`İşlem başarılı yetkili <@${message.author.id}> tarafından kuruldu oyun aktif edildi, kurulum otomatik yapıldı.\n \n**Ayarlanan kanal:** ${mention_kanal} \n**Başlangıç Harfi:** \`${stngssonharf}\` \n \nBaşlangıç Harfi kısmı bozuk değildir acemi çalışmıyoruz. Ücretsiz bir şekilde paylaştık çünkü bazıları bunu satıyor ama haketmiyor :D`)
                        .setFooter('Melodia Winter Time', 'https://images-ext-1.discordapp.net/external/or91-CeO1iGyvc4DmyIoXD22H7TApAOhiJL7zmVKZek/https/cdn.discordapp.com/icons/890256161046134835/f0ae1930d42712006c1c6d974cbb224e.webp')
                        .setTimestamp()
                        .setColor("GREEN");
                    message.channel.send(embed);
                    fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                        if (err) throw err;
                    });
                    return;
                }
            break;
            case 'başlat':
                if(settings_channels[kanal_index].channel_id && settings_channels[kanal_index].channel_id != message.channel.id){
                    return;
                }
                if(!message.member.hasPermission('KICK_MEMBERS')){
                    message.reply('Bu komutu kullanamazsınız.').then(msg => msg.delete({timeout:5000}));
                    message.delete({timeout:5000});
                    return;
                }
                if(game_bool_index && game_bool_value == 'true'){
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL(),"")
                        .setDescription('Kelime oyunu zaten aktif bir durumda.')
                        .setColor("GREEN");
                    message.channel.send(embed);
                    return;
                }
                settings_game_bool[game_bool_index].game_bool = 'true';
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"")
                    .setDescription('Kelime oyunu aktif hale getirildi veriler işlendi.')
                    .setColor("GREEN");
                message.channel.send(embed);
                fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                    if (err) throw err;
                });
            break;
            case 'durdur':
                if(settings_channels[kanal_index].channel_id && settings_channels[kanal_index].channel_id != message.channel.id){
                    return;
                }
                if(!message.member.hasPermission('KICK_MEMBERS')){
                    message.reply('Bu komutu kullanamazsınız.').then(msg => msg.delete({timeout:5000}));
                    message.delete({timeout:5000});
                    return;
                }
                if(game_bool_index && game_bool_value == 'false'){
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL(),"")
                        .setDescription('Kelime oyunu zaten deaktif bir şekilde.')
                        .setColor("GREEN");
                    message.channel.send(embed);
                    return;
                }
                settings_game_bool[game_bool_index].game_bool = 'false';
                const embeds = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"")
                    .setDescription('Kelime oyunu deaktif hale getirildi.')
                    .setColor("GREEN");
                message.channel.send(embeds);
                fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                    if (err) throw err;
                });
            break;
            case 'sıfırla':
                if(settings_channels[kanal_index].channel_id && settings_channels[kanal_index].channel_id != message.channel.id){
                    return;
                }
                if(!message.member.hasPermission('KICK_MEMBERS')){
                    message.reply('Bu komutu kullanamazsınız.').then(msg => msg.delete({timeout:5000}));
                    message.delete({timeout:5000});
                    return;
                }
                settings_game_bool[game_bool_index].game_bool = 'false';
                fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                    if (err) throw err;
                    var settings_son_kelime_yazan = global.fullarr.son_kelime_yazan;
                    var settings_son_kelime = global.fullarr.son_kelime;
                    var settings_kullanilan_kelimeler_guilds = global.fullarr.kullanilan_kelimeler_guilds;
                    let son_kelime_index = settings_son_kelime.findIndex(find => find.guild_id === message.guild.id);
                    let son_kelime_yazan_index = settings_son_kelime_yazan.findIndex(find => find.guild_id === message.guild.id);
                    let kullanilan_kelimeler_guilds_index = settings_kullanilan_kelimeler_guilds.findIndex(find => find.guild_id === message.guild.id);                    
                    let rastgele_kelimeler = ["selam","merhaba","soğan","çayda çıra","kaset","kusmuk","saat","mektep","asparagas","rastgele","çay","vişne suyu","kestane","kazak","tarak","yarak","yara","para","kesici"];
                    let sansli_isim = rastgele_kelimeler[Math.floor(Math.random() * (rastgele_kelimeler.length - 1))];
                    let sonharf = sansli_isim.length;
                    sonharf = sansli_isim.charAt(sonharf - 1);
                    delete settings_son_kelime_yazan[son_kelime_yazan_index].son_kelime_yazan;
                    settings_son_kelime[son_kelime_index].son_kelime = sansli_isim;
                    settings_son_kelime[son_kelime_index].son_harf = sonharf;
                    settings_kullanilan_kelimeler_guilds[kullanilan_kelimeler_guilds_index].kullanilan_kelimeler = [sansli_isim];
                    settings_game_bool[game_bool_index].game_bool = 'true';
                    fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                        if (err) throw err;
                        const embed = new Discord.MessageEmbed()
                            .setTitle('Yeni Kelime')
                            .setDescription(`Oyun yönetici tarafından sıfırlandı ve aktif edildi. Herkese iyi eğlenceler dileriz.\nBaşlangıç kelimesi: **${sansli_isim}**.`)
                            .setColor("GREEN");
                        message.channel.send(embed);
                    });
                });
            break;
            case 'anlam':
                var kelime = args.slice(1).join(' ');
                let link = encodeURI("https://sozluk.gov.tr/gts?ara=" + kelime); 
                request.post(
                    link,
                    {
                        json: {key: 'value',},
                    },
                    (error, res, body) => {
                        if (error) {
                            console.error(error);
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(message.author.username, message.author.avatarURL(),"")
                                .setDescription(`Bir sorun oluştu lütfen yöneticiyle iletişime geçin. ${error}`)
                                .setColor("GREEN");
                            message.channel.send(embed);
                            return;
                        }
                        if(body.error){
                            const embeds = new Discord.MessageEmbed()
                                .setTitle('Nedir ?')
                                .setDescription(`**${kelime}**, bu kelime **Türk Dil Kurumunda** bulunamadı.`)
                                .setColor("GREEN");
                            message.channel.send(embeds).then(del => del.delete({timeout:2000} , message.delete({timeout:2000})));
                            return;
                        }
                        const embedss = new Discord.MessageEmbed()
                            .setTitle(`(${kelime}) Nedir ?`)
                            .setDescription(`**Kelime anlamı:** ` + body[0].anlamlarListe[0].anlam)
                            .setColor("GREEN");
                        message.channel.send(embedss).then(del => del.delete({timeout:15000} , message.delete({timeout:15000})));
                    });
            break;
            case 'puan':
                var settings_puanlar_guilds = global.fullarr.puanlar;
                let puanlar_guilds_index = settings_puanlar_guilds.findIndex(find => find.guild_id === message.guild.id);
                let puanlar_client_index = settings_puanlar_guilds[puanlar_guilds_index].puanlar.findIndex(find => find.client_id === message.author.id);
                let client_puan;
                if(puanlar_client_index != -1){
                    client_puan = settings_puanlar_guilds[puanlar_guilds_index].puanlar[puanlar_client_index].puan;
                }else{
                    client_puan = 0;
                }
                const embedd = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"")
                    .setDescription(`> Bu oyunda puan toplayarak yöneticilerin belirlediği çeşitli ödülleri kzanabilirsin. Ya da başka birşey yönetici bilir onu ben bilmem. Puanın aşağıda gösterildi eğer **null** hatası alıyorsan yönetici ile iletişime geç. \n \nKelime oyundaki toplam puanın: **${client_puan}**`)
                    .setColor("GREEN");
                message.channel.send(embedd).then(del => del.delete({timeout:15000} , message.delete({timeout:15000})));
            break;
            case 'yardım':
                const embedy = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"", 'KELİME YARDIM MENÜ')
                    .setDescription(`\`--kelime kanal #kanal\` => **Kelime kanalını ayarlar.**
                \`--kelime başlat\` => **Kelime oyununu başlatır.**
                \`--kelime durdur\` => **Kelime oyununu durdurur.**
                \`--kelime sıfırla\` => **Oyunu sıfırlar yeni kelime gönderir.**
                \`--kelime anlam kelime\` => **Bir kelimenin anlamını gösterir.**`)
                    .setThumbnail(message.author.avatarURL)
                    .setColor("GREEN")
                    .setTimestamp()
                    .setFooter('ScorpionNN')
                message.channel.send(embedy)
            break;
            default:
                const embedsss = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"")
                    .setDescription('Bilinmeyen komut.')
                    .setColor("GREEN");
                message.channel.send(embedsss).then(del => del.delete({timeout:7000} , message.delete({timeout:7000})));
            break;
        }
    return;
    }
};