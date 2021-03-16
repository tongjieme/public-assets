import * as mongodb from "mongodb";
import * as assert from "assert";

export default function (dbName:string, mongo_user:string, mongo_password:string, mongodb_host:string,mongodb_port:string|number):Promise<mongodb.Db> {
    return new Promise(function (resolve, reject) {
        assert(mongo_user, `mongo_user should have value`)
        assert(mongo_password, `mongo_password should have value`)
        assert(mongodb_host, `mongodb_host should have value`)
        assert(mongodb_port, `mongodb_port should have value`)
        assert(dbName, `dbName should have value`)


        
        console.log("connecting Mongodb");
        
        /* Begin mongo
        ================================================== */

        var url = `mongodb://${mongo_user}:${mongo_password}@${mongodb_host}:${mongodb_port}/`;

        return initMongoWithUrl(url, dbName)
        /* End mongo
        ================================================== */
    })

}

export function initMongoWithUrl (url:string, dbName:string):Promise<mongodb.Db> {
    return new Promise((resolve, reject) => {
        var MongoClient = mongodb.MongoClient;

        MongoClient.connect(url, {
                useNewUrlParser: true,
                poolSize: 100,
                useUnifiedTopology: true
            },
            async function (err, client) {
                if (err) {
                    console.error(err)
                    reject(err)
                    return;
                };

                var dbo = client.db(dbName);
                // @ts-ignore: Unreachable code error
                global.dbo = dbo;
                // @ts-ignore: Unreachable code error
                global.getDb = function (name) {
                    return client.db(name || dbName);
                };

                var collections = await (await dbo.listCollections().toArray()).map(v => v.name);
                console.log("found collections:");
                console.log(collections);
                
                if(!collections.includes("test")) {
                    await dbo.createCollection("test");
                }
                
                // await dbo.createCollection("ipMax");
                // await dbo.createCollection("profiles");
                // await dbo.createCollection("kami");
                // await dbo.createCollection("profiles_history");
                // await dbo.createCollection("settings");
                // await dbo.createCollection("users");

                console.log(`Mongo Database connected: `);
                // @ts-ignore: Unreachable code error
                resolve(dbo);
                // dbo.createCollection("movie91", function(err, res) {
                //   if (err) throw err;
                //   console.log("movie91 Collection created!");
                // });
            });
    })
}