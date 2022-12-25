const { converter } = require("./functions").default;
const prettier = require("prettier");


module.exports['default'] = {
    converter: function (code, pretty = false, options = { parser: "babel" }) {
        if(!code) {
            return {
                error: "you must provide a discord.js v12 code"
            }
        }
        let startTime = Date.now();

        let converted = converter(code);
        
        let prettied = false;
        
        if(pretty) {
            try {
                var c = prettier.format(code, options);
            } catch (error) {};
        
            if(c) {
                prettied = true;
                converted = c;
            }
        }
        
        return {
            prettied,
            code: converted,
            convertTime: Date.now() - startTime
        }
    }
}