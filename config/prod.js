import dotenv from 'dotenv'
dotenv.config()

export default {
    dbURL: process.env.MONGO_URL || 'mongodb+srv://omrig999:Offbeat2025@stations.yvgiuub.mongodb.net/stations.yvgiuub.mongodb.net?retryWrites=true&w=majority',
    dbName: process.env.DB_NAME || 'sprint4_db'
}
