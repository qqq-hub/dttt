import {config} from "../../config/config"
import {Pool} from "pg"

export let pool: Pool;

async function connect() {
    pool = new Pool({
        user: config.db.user,
        password: config.db.password,
        host: config.db.host,
        database: config.db.database,
        port: config.db.port
    })
    try {
    } catch (error) {
        console.log('error connect to db', error);
        process.exit(1);
    }
}

export default connect;