import {OptionValues} from "commander"
import fs from "fs"
import {CLIParams} from "./main"

export function parseParamsAndExit(opts: OptionValues): CLIParams {
    const result = parseParams(opts)
    if (typeof result === "string") {
        console.error(result)
        process.exit(1)
    }
    return result
}

export function parseParams(opts: OptionValues): CLIParams | string {
    if (!isNonNegativeNumber(opts.count)) {
        return "count must be a non-negative number"
    }

    if (!isValidURL(opts.drandUrl)) {
        return "drand URL was not a valid URL"
    }

    const input = opts.file === "" ? process.stdin.fd : opts.file
    const values = fs.readFileSync(input)
        .toString("utf-8")
        .trim()
        .split("\n")

    return {
        count: Number.parseInt(opts.count),
        drandURL: opts.drandUrl,
        randomness: opts.randomness,
        values,
    }
}


function isNonNegativeNumber(input: any): boolean {
    try {
        const num = Number.parseInt(input)
        return !Number.isNaN(num) && num >= 0
    } catch (err) {
        return false
    }
}

function isValidURL(inputURL: any) {
    try {
        new URL(inputURL)
        return true
    } catch (error) {
        return false
    }
}