import {HttpCachingChain, HttpChainClient, roundAt, watch} from "drand-client"
import {select} from "./select"

export type CLIParams = {
    count: number,
    drandURL: string
    randomness?: string
    values: Array<string>
}

export async function main(params: CLIParams) {
    const {values, count, drandURL} = params
    if (count === 0) {
        process.exit(0)
    }
    if (values.length <= count) {
        printWinners(values)
        process.exit(0)
    }

    let randomness: string
    if (params.randomness) {
        randomness = params.randomness
    } else {
        randomness = await fetchDrandRandomness(drandURL)
    }

    const winners = select(count, values, Buffer.from(randomness, "hex"))
    printWinners(winners)
}

async function fetchDrandRandomness(drandURL: string): Promise<string> {
    const drandClient = new HttpChainClient(new HttpCachingChain(drandURL))
    const nextRound = roundAt(Date.now(), await drandClient.chain().info()) + 1
    const abort = new AbortController()

    // we have to do this song and dance because erroring and retrying doesn't work nicely on nodejs
    for await (const beacon of watch(drandClient, abort, {retriesOnFailure: 10})) {
        if (beacon.round !== nextRound) {
            continue
        }

        return beacon.randomness
    }
    throw Error("this should never have happened")
}

function printWinners(winners: Array<string>) {
    winners.forEach(winner => console.log(winner))
}
