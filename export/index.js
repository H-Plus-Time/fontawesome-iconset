const cheerio = require("cheerio");

const fs = require("fs");

function buildIconSubset(bundleName, iconNames) {
    fs.readFile(
        "./fa-all.html", {
            encoding: "utf8"
        },
        (err, data) => {
            let $ = cheerio.load(data);
            $('iron-iconset-svg').attr('name', bundleName)
            if (iconNames.length > 0) {
                $("svg > defs")
                    .children()
                    .not((i, el) => {
                        return iconNames.indexOf($(el).attr("id")) != -1;
                    })
                    .remove();
            }


            fs.writeFile(`${bundleName}.html`, $.html(), (err) => {
                console.error(err);
            })
        }
    );
}

// detect if run directly, else noop
if (require.main == module) {
    let bundlerArgs = process.argv.slice(2);
    // need a bundle name
    if (bundlerArgs.length < 1) {
        console.error("Please provide a bundle name.")
        process.exit(-1);
    }
    buildIconSubset(bundlerArgs[0], bundlerArgs.slice(1));
}