import { execAsync, exec } from "ags/process";
import { monitorFile, readFileAsync } from "ags/file";
import { dependencies } from "../lib/utils";
import GObject from "gi://GObject"

const get = (args: string) => Number(exec(`brightnessctl ${args}`))
const screen = exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`)

const available = dependencies(["brightnessctl"]);

class Brightness extends GObject.Object {
    static instance: Brightness
    static get_default() {
        if (!this.instance)
            this.instance = new Brightness()

        return this.instance
    }

    #screenMax = get("max")
    #screen = get("get") / (get("max") || 1)

    get screen() { return this.#screen }

    set screen(percent) {
        if (percent < 0)
            percent = 0

        if (percent > 1)
            percent = 1

        execAsync(`brightnessctl set ${Math.floor(percent * 100)}% -q`).then(() => {
            this.#screen = percent
            this.notify("screen")
        })
    }

    constructor() {
        super()
        monitorFile(`/sys/class/backlight/${screen}/brightness`, async f => {
            const v = await readFileAsync(f)
            this.#screen = Number(v) / this.#screenMax
            this.notify("screen")
        })
    }
}

let service: Brightness | null = null;

if (available) {
    service = new Brightness();
}

export default service;