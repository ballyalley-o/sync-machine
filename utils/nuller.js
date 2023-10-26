const nuller = (prop) => {
    if (prop === null || prop == "" || prop == undefined) {
        return 'value is not provided'
    }
    return prop
}


module.exports = nuller