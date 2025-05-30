import {PrismaClient} from "@prisma/client";

const Redis = require('ioredis');
import {redis} from "@/utils/redis.js";
import {prisma} from "@/utils/prisma";
import fs from 'fs/promises';
import path from 'path';
import {runtimeStore} from "@/utils/RuntimeStore";
// File for persisting event log
const EVENT_LOG_FILE = path.resolve(process.cwd(), 'connectivity-event-log.json');


// Event log for slow responses
let eventLog = [];
const THRESHOLD_MS = 500; // threshold in ms
const RETENTION_MS = 6 * 60 * 60 * 1000; // retain logs for 1 hour

async function pruneOldEvents() {
    const cutoff = Date.now() - RETENTION_MS;
    while (eventLog.length && eventLog[0].timestamp < cutoff) {
        eventLog.shift();
    }
    // Persist pruned event log to file
    await fs.writeFile(EVENT_LOG_FILE, JSON.stringify(eventLog, null, 2));
}

async function logEvent(service, pingTimeMs) {
    if (pingTimeMs > THRESHOLD_MS) {
        const event = { service, pingTimeMs, timestamp: Date.now() };
        eventLog.push(event);
        // Persist event log to file
        await fs.writeFile(EVENT_LOG_FILE, JSON.stringify(eventLog, null, 2));
    }
}

async function checkRedisConnection(retryCheck = true) {
    try {
        // Try pinging Redis
        const start = Date.now();
        const result = await Promise.race([
            redis.ping(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Redis ping timed out')), 5000))
        ]);
        const pingTimeMs = Date.now() - start;
        await logEvent('redis_status', pingTimeMs);
        if (result === 'PONG') {
            console.log(`✅ Redis connection successful. Ping time: ${pingTimeMs} ms`);
            return { status: 'connected', pingTimeMs };
        }
        // Unexpected response, optionally retry
        if (retryCheck) {
            await redis.connect();
            return checkRedisConnection(false);
        }
        console.warn('❌ Redis connection failed: unexpected response', result);
        return { status: 'not connected', error: `Unexpected PING response: ${result}`, pingTimeMs };
    } catch (err) {
        console.warn('❌ Redis connection failed:', err.message);
        if (retryCheck) {
            try {
                await redis.connect();
                return checkRedisConnection(false);
            } catch (connErr) {
                console.warn('❌ Redis reconnect attempt failed:', connErr.message);
                return { status: 'not connected', error: connErr.message };
            }
        }
        return { status: 'not connected', error: err.message };
    }
}

async function checkPostgresConnection() {
    try {
        // Ensure Prisma client is connected
        await prisma.$connect();
        const start = Date.now();
        await Promise.race([
            prisma.$queryRaw`SELECT 1`,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Postgres query timed out')), 5000))
        ]); // Basic connectivity test with 5s timeout
        const pingTimeMs = Date.now() - start;
        await logEvent('postgres_status', pingTimeMs);
        console.log(`✅ PostgreSQL (Prisma) connection successful. Query time: ${pingTimeMs} ms`);
        return { status: 'connected', pingTimeMs };
    } catch (err) {
        console.warn('❌ PostgreSQL (Prisma) connection failed:', err.message);
        return { status: 'not connected', error: err.message };
    }
}


export async function runChecks(retrievelogs = false, storenew = true) {
    console.log('🔍 Checking service connectivity...');
    // Load persisted event log from file
    try {
      const data = await fs.readFile(EVENT_LOG_FILE, 'utf-8');
      eventLog = JSON.parse(data);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.warn('❌ Failed to load persisted event log:', err.message);
      }
      // If file doesn't exist, start with empty eventLog
    }
    const [redisCon, postgreCon] = await Promise.all([
        checkRedisConnection(),
        checkPostgresConnection()
    ]);

    let log = runtimeStore.getAllAvailabilities()
    if(storenew) {
        runtimeStore.addAvailability("redis", redisCon)
        runtimeStore.addAvailability("postgres", postgreCon)
    }

    await pruneOldEvents();


    return { redis_status: redisCon, postgres_status: postgreCon, log: log };
}
