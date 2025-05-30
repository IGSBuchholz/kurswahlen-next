import { NextResponse } from "next/server";
import {runChecks} from "@/utils/ConnectivityChecker.js";

var cron = require('node-cron');
let cronScheduled = false;

export async function POST(req, res) {
    if (cronScheduled) {
        console.log("Cron job already scheduled");
        return NextResponse.json({ error: 'Cron job already scheduled' }, { status: 400 });
    }


    try {

        const task = cron.schedule('10 * * * * *', async () => {
            console.log('');
            console.log('######################################');
            console.log('#                                    #');
            console.log('#   Running scheduler every minute   #');
            console.log('#                                    #');
            console.log('######################################');
            console.log('');
            await runChecks(true, true);
            // Perform your action here
        });
        cronScheduled = true;

        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }

}