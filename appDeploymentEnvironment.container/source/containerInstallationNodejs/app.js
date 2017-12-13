import { spawn, exec } from 'child_process'
import shell from 'shelljs'
import rethinkDB from 'rethinkdb'
let createStaticInstanceClasses = require('appscript/module/reusableNestedUnit')
import initializeDatabaseData from './databaseData/initializeDatabaseData.js'

;(async function() {
    let connection = await rethinkDB.connect({ host: 'rethinkdb', port: 28015 })

    await initializeDatabaseData(connection)
    
    // Run linux commands on container image OS.
    console.log('Installing all necessary files.')
    let ShellscriptController = await createStaticInstanceClasses({
        implementationType: 'Shellscript',
        cacheName: true, 
        rethinkdbConnection: connection
    })
    // Initialize database data from files.
    let shellscriptController = await ShellscriptController.createContext()
    await shellscriptController.initializeNestedUnit({ nestedUnitKey: '25f4a639-3fcf-4378-9c04-60cf245cd916' })
    
    connection.close()
})()