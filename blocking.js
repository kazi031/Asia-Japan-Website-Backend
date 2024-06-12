// blocking
// line 2 wont execute without line 1 complete running first
// Now if there was a huge calculation that would be a blocking code

// Steps to avoid blocking code

// One is to make it async

const fs = require('fs/promises')
const path = require('path')

const read = async () => {
    const result = fs.readFile(path.join(__dirname, 'package.json'),'utf-8')
    return result
}

read().then(f => console.log(f))
console.log('hi')
