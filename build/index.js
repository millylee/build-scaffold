const fs = require('fs');
const path = require('path');

module.exports = function (gulp) {
    fs.readdirSync(__dirname).filter(function (file) {
        return (file.indexOf(".") !== 0) && (file.indexOf('Task') === 0);
    }).forEach(function (file) {
        const registerTask = function(gulp) {
            return require(path.join(__dirname, file));
        };
        registerTask(gulp);
    });
};
