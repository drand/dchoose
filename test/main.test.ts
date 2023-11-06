import {test} from "@jest/globals"
import {main} from "../src/main"

test("make sure it doesn't blow up", async () => {
    const params = {
        count: 1,
        values: ["a", "b", "c"],
        drandURL: "https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971"
    }
    await main(params)
})