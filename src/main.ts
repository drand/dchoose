import {HttpCachingChain, HttpChainClient, roundAt, watch} from "drand-client"
import {select} from "./select"

export type CLIParams = {
    count: number,
    drandURL: string
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

    const drandClient = new HttpChainClient(new HttpCachingChain(drandURL))
    const nextRound = roundAt(Date.now(), await drandClient.chain().info()) + 1
    const abort = new AbortController()

    // we have to do this song and dance because erroring and retrying doesn't work nicely on nodejs
    for await (const beacon of watch(drandClient, abort, {retriesOnFailure: 10})) {
        if (beacon.round !== nextRound) {
            continue
        }

        const winners = select(count, values, Buffer.from(beacon.randomness, "hex"))
        printWinners(winners)

        abort.abort()
    }
}

function printWinners(winners: Array<string>) {
    winners.forEach(winner => console.log(winner))
}
