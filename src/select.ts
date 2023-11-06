import {sha256} from "@noble/hashes/sha256"

export function select(count: number, values: Array<string>, randomness: Uint8Array): Array<string> {
    // sort the values to ensure deterministic behaviour and avoid
    // attackers being able to modify list ordering to bias the result
    const sortedValues = values.slice().sort()
    // we generate a hash of that list as an input for the selection process
    // and also an output for transparency
    const hashedInput = hashInput(sortedValues)

    // if the count is 0, return no winners
    if (count === 0) {
        return []
    }

    // if we're picking equal or more values than exist, return them all
    if (count >= values.length) {
        return values
    }

    // We sort the values lexicographically to ensure repeatability
    // we set our initial randomness as a hash of the list of values and the drand randomness,
    // to commit the draw to a specific list of values.
    // then we're going to re-hash the randomness for each draw we want to do and turn it into an index.
    // We then draw the value for that index from our `remainingValues` array,
    // remove it from that array, and repeat the process until we have no draws left to do
    let remainingValues = sortedValues
    let remainingDraws = count
    let currentRandomness: Uint8Array = sha256.create()
        .update(hashedInput)
        .update(randomness)
        .digest()
    let chosenValues: string[] = []

    while (remainingDraws > 0) {
        // create the next random value
        currentRandomness = sha256.create()
            .update(currentRandomness)
            .digest()

        // use that randomness to derive the index of the next chosen value
        const chosenIndex = indexFromRandomness(currentRandomness, remainingValues.length)

        // remove the chosen value from the remaining values and add it to the chosen values
        chosenValues = [...chosenValues, remainingValues[chosenIndex]]
        remainingValues = [
            ...remainingValues.slice(0, chosenIndex),
            ...remainingValues.slice(chosenIndex + 1, remainingValues.length)
        ]
        remainingDraws--
    }

    return chosenValues
}

function indexFromRandomness(randomBytes: Uint8Array, totalEntryCount: number): number {
    // should probably add a check that the entryCount is small enough to avoid modulo bias here
    const someBigNumber = bufferToBigInt(randomBytes)
    return Number(someBigNumber % BigInt(totalEntryCount))
}

function bufferToBigInt(buffer: Uint8Array): bigint {
    let output = BigInt(0)
    for (let i = buffer.length - 1; i >= 0; i--) {
        output = output * BigInt(256) + BigInt(buffer[i])
    }

    return output
}

function hashInput(input: Array<string>): string {
    // joining with newlines allows users to hash the file
    // themselves easily for comparisons
    const digest = sha256.create()
        .update(input.join("\n"))
        .digest()
    return Buffer.from(digest).toString("hex")
}
