/**

var ftqqClass = require("../ftqqClass.js");

;(async() => {
    var ftqq = await ftqqClass.new("SCU50940T080116e448c6b")
    ftqq.sendMsg("hi from yeah")
})();

 */
var request = require('request');
class ftqqClass {
    constructor(code = "SCU50940T080116e448c6b") {
        this.code = code;
    }

    static new(code = "SCU50940T080116e448c6b") {
        return new Promise(function (resolve, reject) {
            try {
                resolve(new ftqqClass(code));
            } catch (error) {
                reject(error);
            }
        });
    }

    sendMsg(title = "", content = "") {
        request.post(
            {
                url:`https://sc.ftqq.com/${this.code}.send`, 
                form: {
                    text: title,
                    desp: content
                },
                // json: {
                    
                // },
                strictSSL: false
            },
            function(err,httpResponse,body){
                console.log(body);
                
            }
        );
    }
}
module.exports = ftqqClass