const  logger  = require("../logger")

const analogLooper = (appState) => {
   if (!appState) return logger.error('No Appstate provided')

   try {
     const analogParam = appState.config.includes('Analogue_Display_')
     console.log(appState.config.hasOwnProperty('Analogue_Display_0'), 'isAnalogProps')

     return analogParam
   } catch (err) {
    logger.error(err)
   }

   return ''
}

module.exports = analogLooper