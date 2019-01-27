const fs = require("fs");
const glob = require("glob").sync;
const inputs = glob("posts/*.md");
const marked = require("marked");
const slugger = require("slugger");
const ejs = require("ejs");
fs.copyFileSync("assets/style.css", "out/style.css");
function readMDs() {
    return inputs.map(fn => {
        const raw = fs.readFileSync(fn).toString();
        const html = marked(raw);
        const html_notitle = marked(raw.split("\n").slice(1).join("\n"));
        const title_md = raw.split("\n")[0];
        const title_text = raw.split("\n")[0].split("# ")[1];
        const title_html = marked(raw.split("\n")[0]);
        const title_html_notag = marked(title_text); // False promises... Just gives a <p> instead of a <h1>
        const link = `${slugger(title_text)}.html`;
        return {html, title_html, title_md, title_text, link, title_html_notag, html_notitle};
    });
}
function generateIndex(mds) {
    // ejs.renderFile is ASYNC and idk about a sync one. 
    // EJS Includes will not work
    return ejs.render(fs.readFileSync("assets/homepage.ejs").toString(), {mds});
}
function generatePage(md) {
    // ejs.renderFile is ASYNC and idk about a sync one. 
    // EJS Includes will not work
    return ejs.render(fs.readFileSync("assets/post.ejs").toString(), {md});
}
function generatePagesAndWrite(mds) {
    for (let md of mds) {
        fs.writeFileSync(`out/${md.link}`, generatePage(md));
    }
}
const parsed_mds = readMDs();
fs.writeFileSync("out/index.html", generateIndex(parsed_mds));
generatePagesAndWrite(parsed_mds);