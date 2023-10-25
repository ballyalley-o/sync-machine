const nuller = (prop) => {
   return  prop === 0 && (prop = `${prop} is not provided`)
}


module.exports = nuller