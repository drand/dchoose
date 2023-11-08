import {HttpCachingChain, HttpChainClient, roundAt, watch} from "drand-client"
import {select} from "./select"

export type CLIParams = {
    count: number,
    drandURL: string
    randomness?: string
    values: Array<string>
    verbose: boolean
}

export async function main(params: CLIParams) {
    printWinners(params, await draw(params))
}

type DrawResult = {
    round?: number
    randomness?: string
    totalCount: number
    winners: Array<string>
}

export async function draw(params: CLIParams): Promise<DrawResult> {
    const {values, count, drandURL} = params
    const totalCount =  values.length
    if (count === 0) {
        return {totalCount, winners: []}
    }

    if (values.length <= count) {
        return {totalCount, winners: values}
    }

    if (params.randomness) {
        const winners = select(count, values, Buffer.from(params.randomness, "hex"))
        return {randomness: params.randomness, totalCount, winners}
    }

    const [round, randomness] = await fetchDrandRandomness(drandURL)
    const winners = select(count, values, Buffer.from(randomness, "hex"))
    return {round, randomness, totalCount, winners}
}

async function fetchDrandRandomness(drandURL: string): Promise<[number, string]> {
    const drandClient = new HttpChainClient(new HttpCachingChain(drandURL))
    const nextRound = roundAt(Date.now(), await drandClient.chain().info()) + 1
    const abort = new AbortController()

    // we have to do this song and dance because erroring and retrying doesn't work nicely on nodejs
    for await (const beacon of watch(drandClient, abort, {retriesOnFailure: 10})) {
        if (beacon.round !== nextRound) {
            continue
        }

        return [nextRound, beacon.randomness]
    }
    throw Error("this should never have happened")
}

function printWinners(params: CLIParams, output: DrawResult) {
    if (!params.verbose) {
        output.winners.forEach(winner => console.log(winner))
    } else {
        console.log(JSON.stringify(output))
    }
}
