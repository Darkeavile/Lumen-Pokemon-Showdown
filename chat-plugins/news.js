
//news code 


"use strict";
const fs = require("fs");

let NVDB = {};
try {
    NVDB = JSON.parse(fs.readFileSync("config/nouvelles.json"));
} catch (e) {}

function writeNews () {
    fs.writeFileSync("config/nouvelles.json", JSON.stringify(NVDB));
}

let news = null;

function loadNews() {
    if (Object.keys(NVDB).length) {
        news = Object.keys(NVDB).map(row => {
            let r = NVDB[row];
            return "<h4>" + r.title + "</h4>" + r.message + "<br /><br /><b>—" + r.user + "</b> <font color=gray>(" + r.date + ")</font>";
        }).join("<hr>");
    } else {
        news = null;
    }
}
loadNews();

global.sendNews = function (user) {
    if (news) user.send("|pm| Últimas Noticias| " + user.name + "|/raw " + news);
};

exports.commands = {
    "nouvelles": "news",
    news: {
        "ajouter": "add",
        add: function (target, room, user) {
            if (!this.can("declare")) return false;
            if (!target) return this.parse("/help news");
            
            let parts = target.split(",");
            let title = parts[0].trim();
            let message = parts.slice(1);
            
            if (title === "constructor") return this.errorReply("S'il vou plaît, n'exploitez pas le bug avec les `constructors` des objets en javascript...");
            
            if (NVDB[title]) return this.errorReply("Cette news existe déjà!");
            NVDB[title] = {
                title: title,
                date: new Date().toLocaleDateString('fr-FR'),
                user: user.name,
                message: message.join(",").trim(),
            };
            writeNews();
            loadNews();
            this.sendReply("La news vient d'être ajoutée.")
        },
        "effacer": "delete",
        delete: function (target, room, user) {
            if (!this.can("declare")) return false;
            if (!target) return this.parse("/help news");
            if (target === "constructor") return this.errorReply("S'il vou plaît, n'exploitez pas le bug avec les `constructors` des objets en javascript...");
            
            if (!NVDB[target]) return this.errorReply("Cette news n'existe pas.");
            
            delete NVDB[target];
            writeNews();
            loadNews();
            this.sendReply("La news a été effacée.");
        },
        
        "regarder": "view",
        "": "view",
        "view": function (target, room, user) {
            if (!news) return user.popup("Il n'y a pas de news.");
            user.popup("|html|" + news);
        }
    },
    newshelp: [
        "/news add [titre], [message] - Ajouter une nouvelle news dans la box",
        "/news delete [titre] - Supprimer une news dans la box",
    ],
};
