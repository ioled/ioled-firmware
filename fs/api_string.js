let StringUtils = {
    ltrim: function(string) {
        let idx = 0;
        while(string[idx] === ' ') {
            idx++;
        }
        return string.slice(idx, string.length);
    },
    rtrim: function(string) {
        let idx = string.length - 1;
        while(string[idx] === ' ') {
            idx--;
        }
        return string.slice(0, idx + 1);
    },
    trim: function(string) {
        return StringUtils.rtrim(StringUtils.ltrim(string));
    },
    split: function(string, delimeter, trim) {
        delimeter = (delimeter === undefined ? ' ' : delimeter);
        trim = (trim === undefined ? true : trim);
        string += delimeter;   
        let counter = 0;
        let buffer = "";
        let result = [];
        for(let idx = 0 ; idx < string.length ; idx++) {
            if(string[idx] === delimeter) {
                if(trim === true) {
                    buffer = StringUtils.trim(buffer);
                }
                if(buffer !== '') {
                    result[counter++] = buffer;
                }
                buffer = "";
            } else {
                buffer += string[idx];
            }
        }
        return result;
    }
}