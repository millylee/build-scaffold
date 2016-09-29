const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

// reg
const deep = 3;
runBuild('build');

function runBuild(buildPath) {
    if (--deep < 0) {
        throw new Error('something wrong in require tasks!');
        return;
    }

    buildPath = path.join('../', buildPath);

    if (fs.existsSync(buildPath)) {
        require(buildPath)(gulp);
    } else {
        runBuild(buildPath);
    }
}
