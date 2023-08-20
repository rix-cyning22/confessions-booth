const fs = require("fs");

exports.delFile = filePath => 
    fs.unlink(filePath, err => {
        if (err)
            console.log(err);
    })