setTimeout(() => {
    throw new Error('oops')
}, 300)

process.on('uncaughtException', () => {

}) // there was an error that was thrown and no one caught and I can handle that here.

process.on('unhandledRejection', () => {

}) // async error happening in a promise. I can handle it here.