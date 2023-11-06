import {describe, it, expect} from "@jest/globals"
import {select} from "../src/select"

describe("select", () => {
    const randomness = Buffer.from("34b9bc1f9afda7a472c5bff6785d272aa49f0c3a46a02b1896040b44fb759ac3", "hex")

    it("returns the whole list if it's less than count, without randomness", async () => {
        const values = ["a", "b", "c", "d"]
        const result = select(20, values, randomness)

        expect(result).toEqual(values)
    })

    it("returns nothing if count is 0, without randomness", async () => {
        const values = ["a", "b", "c", "d"]
        const result = select(0, values, randomness)

        expect(result).toEqual([])
    })

    it("returns selected values from the list", async () => {
        const values = ["a", "b", "c", "d"]
        const count = 2
        const result = select(count, values, randomness)

        expect(result.length).toEqual(count)

        // they should have existed in the first place
        result.forEach(w => values.includes(w))

        // winners should be unique!
        expect(new Set(result).size == result.length)
    })

    it("draws are deterministic", async () => {
        const values = ["a", "b", "c", "d"]
        const count = 2
        const result = select(count, values, randomness)
        const result2 = select(count, values, randomness)

        expect(result).toEqual(result2)
    })

    it("different randomness can return different results", () => {
        const values = ["a", "b", "c", "d"]
        const count = 1
        const result = select(count, values, randomness)
        const otherRandomness = Buffer.from("c8396fe1c944a3663fec03dff56f0a3f06160640924ae3b93e2cb8c2feb6951e", "hex")
        const result2 = select(count, values, otherRandomness)

        expect(result).not.toEqual(result2)
    })
})
