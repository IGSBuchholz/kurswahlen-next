import {NextResponse} from "next/server";
const { Engine } = require('json-rules-engine')

let engine = new Engine()

engine.addRule({
    conditions: {
        any: [{
            all:  [{
                fact: 'test',
                operator: 'equal',
                value: true
            }]
        }]
    }
})

export function GET(req) {
    return NextResponse.json({
        test: "test"
    });
}