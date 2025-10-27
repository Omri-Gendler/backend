import configProd from './prod.js'
import configDev from './dev.js'

export var config

if (process.env.NODE_ENV === 'production') {
    config = configProd
} else {
    config = configDev
}

//* Uncomment the following line to use guest mode
// config.isGuestMode = true

//* Quick Atlas Testing - Uncomment the following line to use Atlas without setting NODE_ENV
// config = configProd

console.log(`🚀 Using ${process.env.NODE_ENV === 'production' ? 'PRODUCTION (Atlas)' : 'DEVELOPMENT (Local)'} database configuration`)
console.log(`📍 Database URL: ${config.dbURL}`)
console.log(`📦 Database Name: ${config.dbName}`)