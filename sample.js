
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
