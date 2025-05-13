import express from 'express';
import next from 'next';
import axios from 'axios';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

//
import http from 'http';
//

app.prepare().then(async () => {
    const server = express();
    const httpServer = http.createServer(server);
    const PORT = process.env.PORT || 3000;

    // Scheduler
    const runScheduler = async () => {
        try {
            setTimeout(async () => {
                try {
                    await axios.post(
                        `http://localhost:${PORT}/api/services/scheduler`,
                        {},                                   // <–– your actual request body
                        { headers: { "Content-Type": "application/json" } } // <–– axios config
                    )
                } catch (err) {
                    console.error(err)
                }
            }, 1000)
        } catch (error) {
            console.log(error)
        }
    }

    server.all(/.*/, (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);

        runScheduler();
    });
});