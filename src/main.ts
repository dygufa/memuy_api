const pm2 = require("pm2");

const instances = process.env.WEB_CONCURRENCY || -1; // Set by Heroku or -1 to scale to max cpu core -1
const maxMemory = process.env.WEB_MEMORY || 512;

pm2.connect(() => {
    pm2.start({
        script: "memuy.js",
        node_args: "--require dotenv/config",
        exec_mode: "cluster",
        instances: instances,
        max_memory_restart: maxMemory + "M", // Auto restart if process taking more than XXmo
    }, (err: any) => {
        if (err) return console.error("Error while launching applications", err.stack || err);
        console.log("PM2 and application has been succesfully started");

        // Display logs in standard output 
        pm2.launchBus((err: any, bus: any) => {
            console.log("[PM2] Log streaming started");

            bus.on("log:out", (packet: any) => {
                console.log("[App:%s] %s", packet.process.name, packet.data);
            });

            bus.on("log:err", (packet: any) => {
                console.error("[App:%s][Err] %s", packet.process.name, packet.data);
            });
        });
    });
});
