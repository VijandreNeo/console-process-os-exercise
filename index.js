import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import readline from 'node:readline'

const [, , inputFilePath] = process.argv

let filePath
let journalEntries = []

try {
  filePath = path.normalize(inputFilePath)

  if (fs.existsSync(filePath)) {
    const fileLogEntries = fs.readFileSync(filePath).toString().split('\n')

    fileLogEntries.pop()

    journalEntries = fileLogEntries.map((logEntry) => {
      const splitString = logEntry.split('] ')
      return { date: `${splitString[0]}]`, entry: `${splitString[1]}` }
    })
  }
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
    console.table(journalEntries.length === 0 ? 'No entries' : journalEntries)
    break
  }

  case 's': {
    console.log(`
    Running Operating System: ${os.type()}
    Working Directory: ${process.cwd()}
    Program Uptime: ${Math.floor(process.uptime())} ${Math.floor(process.uptime()) > 1 ? 'seconds' : 'second'}
    Number of Entries: ${journalEntries.length === 0 ? 0 : journalEntries.length}
    Date of Last Entry: ${journalEntries.length === 0 ? 'No entries yet' : journalEntries[journalEntries.length - 1].date}
    `)
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

    const journalEntry = { date: `[${currentTime}]`, entry: `${line}` }

    journalEntries.push(journalEntry)

    fs.appendFileSync(filePath, `${journalEntry.date} ${journalEntry.entry}\n`)

    console.timeEnd('Time it took to add entry')
    break
  }
  }
})
