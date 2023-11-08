import {describe, it, expect} from "@jest/globals"
import {draw, main} from "../src/main"

describe("draws", () => {
    describe("main function", () => {
        it("verbose shouldn't blow up", async () => {
            const params = {
                count: 1,
                values: ["a", "b", "c"],
                drandURL: "https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
                verbose: false,
            }
            await main(params)
        })
        it("non-verbose shouldn't blow up", async () => {
            const params = {
                count: 1,
                values: ["a", "b", "c"],
                drandURL: "https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
                verbose: false,
            }
            await main(params)
        })
    })
    describe("draw function", () => {
        it("should return no values for 0 count", async () => {
            const params = {
                count: 0,
                values: ["a", "b", "c"],
                drandURL: "https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
                verbose: true,
            }
            const result = await draw(params)
            expect(result.round).toBeUndefined()
            expect(result.randomness).toBeUndefined()
            expect(result.totalCount).toEqual(3)
            expect(result.winners).toEqual([])
        })
        it("should return all the values for a count less than the number of values", async () => {
            const params = {
                count: 5,
                values: ["a", "b", "c"],
                drandURL: "https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
                verbose: true,
            }
            const result = await draw(params)
            expect(result.round).toBeUndefined()
            expect(result.randomness).toBeUndefined()
            expect(result.totalCount).toEqual(3)
            expect(result.winners).toEqual(params.values)
        })
        it("should return the same result each time for custom randomness", async () => {
            const params = {
                count: 1,
                values: ["a", "b", "c"],
                randomness: "5af934e9a82fcbc0f7d9cb7be197f6a9f74e10a49227f3dc72ed0686f7ab85f2",
                drandURL: "https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
                verbose: true,
            }
            const result = await draw(params)
            expect(result.round).toBeUndefined()
            expect(result.randomness).toEqual(params.randomness)
            expect(result.totalCount).toEqual(3)

            const result2 = await draw(params)
            expect(result).toEqual(result2)
        })
        it("should return a non-zero round for real randomness", async () => {
            const params = {
                count: 1,
                values: ["a", "b", "c"],
                drandURL: "https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
                verbose: true,
            }
            const result = await draw(params)
            expect(result.round).toBeGreaterThan(1)
            expect(result.winners).toHaveLength(params.count)
            expect(result.totalCount).toEqual(3)
        })
    })
})
