import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import os from 'node:os'

const [, , inputFilePath] = process.argv

let filePath

try {
  filePath = path.normalize(inputFilePath)
} catch (error) {
  process.stderr.write(error)
}

const rl = readline.createInterface({
  input: process.stdin,
})

console.log(`
Welcome, please use these commands. 
L - Show log entries
S - Program Statistics
H - Show all commands
Q - Quit Program
Any sentence - Add new log entry
`)

rl.on('line', (line) => {
  switch (line.toLowerCase()) {
  case 'q': {
    process.exit(0)
    break
  }

  case 'l': {
    console.time('Time it took to gather data')

    if (fs.existsSync(filePath)) {
      const logEntries = fs.readFileSync(filePath).toString().split('\n')

      logEntries.pop()

      const test = logEntries.map((logEntry) => {
        const splitString = logEntry.split('] ')
        return { Date: `${splitString[0]}]`, Entry: `${splitString[1]}` }
      })
      console.table(test)
    } else {
      console.log('No logs in the journal yet')
    }

    console.timeEnd('Time it took to gather data')
    break
  }

  case 's': {
    console.log(`
    Running Operating System: ${os.type()}
    Working Directory: ${process.cwd()}
    Program Uptime: ${Math.floor(process.uptime())} ${Math.floor(process.uptime()) > 1 ? 'seconds' : 'second'}`)
    break
  }

  case 'h': {
    console.log(`
  L - Show log entries
  S - Program Statistics
  H - Show all commands
  Q - Quit Program
  Any sentence - Add new log entry`)
    break
  }

  default: {
    console.time('Time it took to add entry')

    const currentTime = new Date(Date.now()).toString()
      .split(' ')
      .slice(0, 5)
      .join(' ')
    fs.appendFileSync(filePath, `[${currentTime}] ${line}\n`)

    console.timeEnd('Time it took to add entry')
    break
  }
  }
})
