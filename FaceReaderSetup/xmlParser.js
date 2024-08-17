const xml2js = require('xml2js');

const parser = new xml2js.Parser();

function parseXML(xmlString) {
    return new Promise((resolve, reject) => {
        parser.parseString(xmlString, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

module.exports = { parseXML };