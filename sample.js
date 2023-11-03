
//-----------------------------SANDBOX: just for snippets and testing
// const http = require('http')
// const express = require('express')
// const app = express()
// const server = http.createServer(app)
// const io = require('socket.io')(server)

// // Set up Chokidar and other middleware
// // ...

// // Handle the WebSocket events
// io.on('connection', (socket) => {
//   console.log('Client connected')

//   // Handle 'refresh' event from clients to refresh the page
//   socket.on('refresh', (data) => {
//     console.log('Refresh event received:', data)
//     // Add logic here to refresh the page on the client side
//   })

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('Client disconnected')
//   })
// })

// // Start the server
// server.listen(3000, () => {
//   console.log('Server is running on port 3000')
// })

// // Your file watching code goes here


// const iniSimPrepTest = async (req, res) => {
//   const burnInParams = {
//     zeros: [
//       'CrimpOutSol',
//       'CrimpOutSol',
//       'CrimpLeftProx',
//       'CrimpRightProx',
//       'HomeProx',
//       'DownProx',
//       'UpSol',
//       'DecoilerScalperProx',
//     ],
//     time: 'Time',
//     targetWindow: 'TargetWindow',
//   }

//   if (USERPROFILE) {
//     fs.readFile(paths.testFilesPath, 'utf8', (err, data) => {
//       if (err) {
//         res.status(500).json({ error: err.message })
//         return
//       }

//       try {
//         let lines = data.split('\n')
//         const modifiedLines = []

//         for (const line of lines) {
//           let modifiedLine = line

//           for (const param of burnInParams.zeros) {
//             if (line.includes(param)) {
//               // Split the line to separate the parameter name and its value
//               const parts = line.split('=')
//               if (parts.length === 2) {
//                 // Trim and check if it's a valid number
//                 const value = parseFloat(parts[1].trim())
//                 if (!isNaN(value) && value !== 0) {
//                   // Change the value to 0
//                   parts[1] = '0'
//                   modifiedLine = parts.join('=')
//                 }
//               }
//             }
//           }

//           modifiedLines.push(modifiedLine)
//         }

//         // Join the modified lines back into a single string
//         const modifiedData = modifiedLines.join('\n')

//         // Write the modified data back to the file
//         fs.writeFile(paths.testFilesPath, modifiedData, (writeErr) => {
//           if (writeErr) {
//             res.status(500).json({ error: writeErr.message })
//           } else {
//             res
//               .status(200)
//               .json({ message: 'CrimpIn parameters ready for Simulation.' })
//           }
//         })
//       } catch (err) {
//         logger.error(err)
//         res.status(500).json({ error: err.message })
//       }
//     })
//   }
// }


// compare arrs

// Sample data (old and updated INI data as arrays of strings)
const oldIniData = [
  'Parameter1=10',
  'Parameter2=20',
  'Parameter3=30',
  'Parameter4=40',
];

const updatedIniData = [
  'Parameter1=10',
  'Parameter2=25', // Changed value
  'Parameter3=30',
  'Parameter5=50', // Added parameter
];

// Function to parse INI data into objects
function parseIniData(data) {
  const iniObject = {};
  for (const line of data) {
    const [param, value] = line.split('=');
    iniObject[param] = value;
  }
  return iniObject;
}

// Parse the old and updated INI data
const oldIniObject = parseIniData(oldIniData);
const updatedIniObject = parseIniData(updatedIniData);

// Compare the objects to identify changes
const changedParams = [];

for (const param in oldIniObject) {
  if (updatedIniObject[param] !== undefined) {
    if (oldIniObject[param] !== updatedIniObject[param]) {
      changedParams.push({
        parameter: param,
        oldValue: oldIniObject[param],
        updatedValue: updatedIniObject[param],
      });
    }
  } else {
    // Parameter missing in the updated data
    changedParams.push({
      parameter: param,
      oldValue: oldIniObject[param],
      updatedValue: 'Parameter Removed',
    });
  }
}

for (const param in updatedIniObject) {
  if (oldIniObject[param] === undefined) {
    // New parameter in the updated data
    changedParams.push({
      parameter: param,
      oldValue: 'Parameter Added',
      updatedValue: updatedIniObject[param],
    });
  }
}

// Display the list of changed parameters
console.log(changedParams);


function compareArrays(prevArr, modArr) {
  const changes = []

  const prevArrSplit = prevArr.split('\n')
  const modArrSplit = modArr.split('\n')

  for (let i = 0; i < prevArrSplit.length || i < modArrSplit.length; i++) {
    if (i < prevArrSplit.length && i < modArrSplit.length) {
      if (prevArrSplit[i] !== modArrSplit[i]) {
        changes.push(
          `Line ${i + 1}: '${prevArrSplit[i]}' -> '${modArrSplit[i]}'`
        )
      }
    } else if (i < prevArrSplit.length) {
      changes.push(`Line ${i + 1}: '${prevArrSplit[i]}' -> Removed`)
    } else {
      changes.push(`Line ${i + 1}: Added '${modArrSplit[i]}'`)
    }
  }

  return changes
}

// Compare the arrays and get the changed lines
const changedLines = compareArrays(oldArray, updatedArray)

// Output the changed lines
console.log(changedLines)
// _____________________________________________________________________

let compare
let counter = 0

// if (modifiedIni) {
//   prevIniJoin = prevIni.join('\n')
//   modIniJoin = modifiedIni.join('\n')
//   compare = compareArr(prevIniJoin, modIniJoin) // Assuming compareArr is a function to compare the two strings
// }

// // Check if the data has changed
// if (compare) {
//   fs.writeFile(paths.testFilesPath, modifiedData, (writeErr) => {
//     if (writeErr) {
//       res.status(500).json({ error: writeErr.message })
//     } else {
//       res.status(201).json({
//         message: RESPONSE.iniSimulation,
//         params: { modifiedData, data },
//         counter,
//       })
//     }
//   })
// } else {
//   res.status(200).json({
//     message: 'No Changes found',
//     params: [],
//     counter,
//   })
// }


// const { BURN_IN_PARAMS } = require('../../constants')

// const iniBool = (param, modifiedLine, line) => {
//   const isBool = line.includes(BURN_IN_PARAMS[param])
//   let boolChanged = modifiedLine

//   if (isBool) {
//     const parts = line.split('=')
//     if (parts.length === 2) {
//       const boolValue = JSON.parse(parts[1].trim())
//       // Convert burnin to true
//       if (boolValue === false) {
//         parts[1] = 'true'
//         boolChanged = parts.join('=')
//       }
//     }
//   }

//   return boolChanged // Return the modified line
// }

// const iniLooper = { iniBool }
// module.exports = iniLooper

// old snippet for loop in iniSimulation:

// const time = line.match(BURN_IN_PARAMS.time)
  // if (time) {
  //   const parts = line.split('=')
  //   if (parts.length === 2) {
  //     const timeValue = parseFloat(parts[1].trim())
  //     // convert burnin to true
  //     if (timeValue < 300) {
  //       parts[1] = 300
  //       modifiedLine = parts.join('=')
  //     }
  //   }
  // }

  //loop snippet for zeros in ini sim
// for (const param of BURN_IN_PARAMS.zeros) {
      //   const PARAM = line.includes(param)

      //   if (PARAM) {
      //     // Split the line to separate the parameter name and its value
      //     const parts = line.split('=')
      //     if (parts.length === 2) {
      //       // Trim and check if it's a valid number
      //       const value = parseFloat(parts[1].trim())
      //       if (!isNaN(value) && value !== 0) {
      //         // Change the value to 0
      //         parts[1] = '0'
      //         modifiedLine = parts.join('=')
      //       }
      //     }
      //   }
      // }


      // const fs = require('fs').promises // Use promisified version of fs for async/await
      // const path = require('path') // Import the 'path' module for file paths

      // const iniCompare = async (req, res) => {
      //   try {
      //     if (USERPROFILE) {
      //       // Assuming USERPROFILE is defined somewhere
      //       const iniOne = await fs.readFile(paths.iniPath, 'utf8')
      //       const iniTwo = await fs.readFile(paths.testFilesPath, 'utf8')

      //       const linesOne = iniOne.split('\n')
      //       const linesTwo = iniTwo.split('\n')

      //       const comparisons = compareArr(linesOne, linesTwo) // Assuming compareArr is defined somewhere

      //       res.status(200).json({
      //         message: 'CHANGES',
      //         comparisons: { iniOne: linesOne, iniTwo: linesTwo },
      //       })
      //     } else {
      //       res.status(401).json({ error: 'Unauthorized' })
      //     }
      //   } catch (err) {
      //     console.error(err)
      //     res.status(500).json({ error: err.message })
      //   }
      // }

      function compareArrByName(prevArr, modArr) {
        const changes = []

        if (!Array.isArray(prevArr) || !Array.isArray(modArr)) {
          // Handle non-array inputs
          return changes
        }

        const prevNames = prevArr.map((item) => item.name)
        const modNames = modArr.map((item) => item.name)

        prevNames.forEach((prevName, index) => {
          if (modNames[index] !== prevName) {
            changes.push(`Name: '${prevName}' -> '${modNames[index]}'`)
          }
        })

        for (let i = prevNames.length; i < modNames.length; i++) {
          changes.push(`Added Name: '${modNames[i]}'`)
        }

        for (let i = modNames.length; i < prevNames.length; i++) {
          changes.push(`Removed Name: '${prevNames[i]}'`)
        }

        return changes
      }

      function compareArrByProperty(prevArr, modArr, propertyName) {
        const changes = []

        if (!Array.isArray(prevArr) || !Array.isArray(modArr)) {
          // Handle non-array inputs
          return changes
        }



        const prevPropertyValues = prevArr.map((item) => item[propertyName])
        const modPropertyValues = modArr.map((item) => item[propertyName])

        prevPropertyValues.forEach((prevValue, index) => {
          if (modPropertyValues[index] !== prevValue) {
            changes.push(
              `${propertyName}: '${prevValue}' -> '${modPropertyValues[index]}'`
            )
          }
        })

        for (
          let i = prevPropertyValues.length;
          i < modPropertyValues.length;
          i++
        ) {
          changes.push(`Added ${propertyName}: '${modPropertyValues[i]}'`)
        }

        for (
          let i = modPropertyValues.length;
          i < prevPropertyValues.length;
          i++
        ) {
          changes.push(`Removed ${propertyName}: '${prevPropertyValues[i]}'`)
        }

        return changes
      }

const fs = require('fs').promises

async function comparePropertiesFromFile(prevFile, modFile) {
  const changes = []

  try {
    const prevData = await fs.readFile(prevFile, 'utf8')
    const modData = await fs.readFile(modFile, 'utf8')

    const prevProperties = parseProperties(prevData)
    const modProperties = parseProperties(modData)

    // Compare properties
    for (const key in prevProperties) {
      if (key in modProperties) {
        if (prevProperties[key] !== modProperties[key]) {
          changes.push(
            `[${key}] Property Changed: '${prevProperties[key]}' -> '${modProperties[key]}'`
          )
        }
      } else {
        changes.push(`[${key}] Property Removed: '${prevProperties[key]}'`)
      }
    }

    for (const key in modProperties) {
      if (!(key in prevProperties)) {
        changes.push(`[${key}] Property Added: '${modProperties[key]}'`)
      }
    }
  } catch (err) {
    console.error(err)
  }

  return changes
}


// ---------------------------------------------------------------

const fs = require('fs').promises // Use promisified fs for async/await

async function comparePropertiesFromFile(prevFile, modFile) {
  const changes = []

  try {
    const prevData = await fs.readFile(prevFile, 'utf8')
    const modData = await fs.readFile(modFile, 'utf8')

    const prevProperties = prevData.split('\n')
    const modProperties = modData.split('\n')

    prevProperties.forEach((prevProp, index) => {
      if (modProperties[index] !== prevProp) {
        changes.push(
          `Property ${index + 1}: '${prevProp}' -> '${modProperties[index]}'`
        )
      }
    })

    for (let i = prevProperties.length; i < modProperties.length; i++) {
      changes.push(`Added Property ${i + 1}: '${modProperties[i]}'`)
    }

    for (let i = modProperties.length; i < prevProperties.length; i++) {
      changes.push(`Removed Property ${i + 1}: '${prevProperties[i]}'`)
    }
  } catch (err) {
    console.error(err)
  }

  return changes
}

// Example usage:
// const prevFile = 'prevProperties.txt' // Replace with your file paths
// const modFile = 'modProperties.txt' // Replace with your file paths

comparePropertiesFromFile(prevFile, modFile)
  .then((changes) => {
    console.log(changes)
  })
  .catch((err) => {
    console.error(err)
  })


function parseProperties(data) {
  const properties = {}
  const lines = data.split('\n')
  let currentSection = ''

  for (const line of lines) {
    if (line.startsWith('[') && line.endsWith(']')) {
      currentSection = line.slice(1, -1)
    } else {
      const parts = line.split('=')
      if (parts.length === 2) {
        const key = parts[0].trim()
        const value = parts[1].trim()
        if (currentSection && key) {
          properties[key] = value
        }
      }
    }
  }
  return properties
}

// Example usage:
// const prevFile = 'prevProperties.txt' // Replace with your file paths
// const modFile = 'modProperties.txt' // Replace with your file paths

comparePropertiesFromFile(prevFile, modFile)
  .then((changes) => {
    console.log(changes)
  })
  .catch((err) => {
    console.error(err)
  })


  // --auto refresh
  const sysLog = async (req, res) => {
    if (USERPROFILE) {
      const filePath = await paths.livePath('sys', 'txt')
      logger.log(filePath)

      // Set the appropriate headers for SSE
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const stream = fs.createReadStream(filePath, { encoding: 'utf8' })
      stream.on('data', (data) => {
        // Split the log data and send it as a message to the client
        const lines = data.split('\n').reverse()
        const dateLog = sysLooper(lines, 'date')
        const sysLog = sysLooper(lines, 'log')
        const response = {
          dateLog,
          sysLog,
          revLines: lines,
        }
        res.write(`data: ${JSON.stringify(response)}\n\n`)
      })

      // Handle errors and end of the stream
      stream.on('error', (error) => {
        console.error(error)
        res.status(500).json({ error: error.message })
        res.end()
      })

      stream.on('end', () => {
        res.end()
      })
    }
  }

    // client side :

    const eventSource = new EventSource('/your-sse-endpoint')

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // Process and display the data as needed
      console.log(data)
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
    }

// adding websocket
    require('colors')
    const fs = require('fs')
    const dotenv = require('dotenv')
    const express = require('express')
    const http = require('http') // Import the HTTP module
    const WebSocket = require('ws') // Import the ws library for WebSocket support
    const mainRoute = require('../routes/index.js')
    const logger = require('../middleware/logger.js')
    const morgan = require('morgan')
    const GLOBAL = require('./global.js')
    dotenv.config()

    const PORT = GLOBAL.port

    class App {
      constructor() {
        this.app = express()
        this.app.use(express.json())
        this.app.use(morgan('short'))
        this.registerRoutes()

        // Create an HTTP server and attach it to your Express app
        this.server = http.createServer(this.app)

        // Create a WebSocket server that listens on the same server
        this.wss = new WebSocket.Server({ server: this.server })

        // Set up WebSocket connections
        this.wss.on('connection', (ws) => {
          // Handle new WebSocket connections here

          // Read the log file periodically and send updates to the connected clients
          const interval = setInterval(() => {
            // Replace this logic with your log file reading and sending updates
            const data = 'New log data' // Replace with actual log data

            // Send the data to the client
            ws.send(data)
          }, 1000)

          ws.on('close', () => {
            clearInterval(interval)
          })
        })
      }

      registerRoutes() {
        mainRoute(this.app)
      }

      start() {
        try {
          this.server.listen(PORT, () => {
            logger.server(PORT, true)
          })
        } catch (error) {
          logger.error(error.message)
          logger.server(PORT, false)
        }
      }
    }

    module.exports = App

    //

    const WebSocket = require('ws')
    const fs = require('fs')
    const paths = require('./paths') // Import your paths module
    const logger = require('../middleware/logger.js')
    const sysLooper = require('./sysLooper') // Import your sysLooper function

    const createWebSocketServer = (server) => {
      const wss = new WebSocket.Server({ server })

      wss.on('connection', (ws) => {
        const filePath = paths.livePath('sys', 'txt')

        // read the log file and send updates to connected WebSocket clients
        const stream = fs.createReadStream(filePath, { encoding: 'utf8' })

        stream.on('data', (data) => {
          const lines = data.split('\n').reverse()
          const dateLog = sysLooper(lines, 'date')
          const sysLog = sysLooper(lines, 'log')
          const response = {
            dateLog,
            sysLog,
          }
          ws.send(JSON.stringify(response))
        })

        stream.on('error', (error) => {
          logger.error(error)
        })

        ws.on('close', () => {

          // Cleanup when the WebSocket client disconnects
          stream.destroy()
        })
      })
    }

    module.exports = createWebSocketServer

