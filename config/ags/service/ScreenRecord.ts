import { AstalIO, execAsync, GLib, GObject, interval } from "astal";
import { ensureDirectory } from "../lib/utils";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import { bash } from "../lib/utils";
import { Variable } from "astal";

// export const recordMicrophoneToggle = Variable(false);
export const recordInternalAudioToggle = Variable(false);
export const recordOnlySelectedScreenToggle = Variable(false);

const now = () => GLib.DateTime.new_now_local().format("%Y-%m-%d_%H-%M-%S");
const hypr = AstalHyprland.get_default();

const ScreenRecorderService = GObject.registerClass(
  {
    Properties: {
      timer: GObject.ParamSpec.int64(
        "timer",
        "Timer",
        "A property containing recording timer",
        GObject.ParamFlags.READABLE,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        0,
      ),
      recording: GObject.ParamSpec.boolean(
        "recording",
        "Recording",
        "A property containing recording state",
        GObject.ParamFlags.READABLE,
        false,
      ),
      recordAudio: GObject.ParamSpec.boolean(
        "recordAudio",
        "Record audio",
        "Record audio",
        GObject.ParamFlags.READWRITE,
        false,
      ),
      recordSelectRegion: GObject.ParamSpec.boolean(
        "recordSelectRegion",
        "record Selected Region",
        "Record Selected Region only",
        GObject.ParamFlags.READWRITE,
        false,
      ),
    },
  },
  class Recorder extends GObject.Object {
    #recorder: AstalIO.Process | null = null;
    #recordings = GLib.getenv("HOME") + "/Videos/Screenrecords";
    #screenshots = GLib.getenv("HOME") + "/Pictures/Screenshots";
    #file = "";
    #interval: AstalIO.Time | null = null;

    #timer = 0;
    #recordAudio = false;
    #recordSelectRegion = false;

    get recording() {
      return this.#recorder != null;
    }
    get timer() {
      return this.#timer;
    }

    get recordAudio() {
      return this.#recordAudio;
    }

    async setAudioRecord(val: boolean) {
      this.#recordAudio = val;
    }

    get recordSelected() {
      return this.#recordSelectRegion;
    }

    async setRecordSelected(val: boolean) {
      this.#recordSelectRegion = val;
    }

    async start() {
      if (this.recording) return;

      ensureDirectory(this.#recordings);
      this.#file = `${this.#recordings}/${now()}.mp4`;
      // const output = hypr.focusedMonitor.name;
      // const cmd = `wl-screenrec --output ${output} --filename ${this.#file}`;

      let cmd = `wf-recorder -c h264_vaapi -f ${this.#file}`;

      if (this.#recordSelectRegion) {
        cmd += ` -g "${await bash("slurp")}"`;
      }

      if (this.#recordAudio) {
        cmd += ` -a`;
      }

      recordOnlySelectedScreenToggle.set(!recordOnlySelectedScreenToggle.get())
      recordInternalAudioToggle.set(!recordInternalAudioToggle.get())

      this.#recorder = AstalIO.Process.subprocess(cmd);
      this.notify("recording");

      this.#timer = 0;
      this.#interval = interval(1000, () => {
        this.notify("timer");
        this.#timer++;
      });
    }

    async stop() {
      if (!this.#recorder) return;

      try {
        this.#recorder.signal(15);
        this.#recorder = null;
        this.notify("recording");

        if (this.#interval) this.#interval.cancel();
        this.#timer = 0;
        this.notify("timer");

        const res = await execAsync([
          "notify-send",
          "Screenrecord",
          this.#file,
          "-a",
          "Screenrecord",
          "-i",
          "video-x-generic-symbolic",
          "--hint=string:image:video-x-generic-symbolic",
          "-A",
          "file=Show in Files",
          "-A",
          "view=View",
        ]);

        switch (res) {
          case "file":
            return execAsync([
              GLib.getenv("FILE_MANAGER") || "xdg-open",
              this.#recordings,
            ]);
          case "view":
            return execAsync(["xdg-open", this.#file]);
        }
      } catch (e) {
        console.error("Error executing screenrecord-end script:", e);
      }
    }
  },
);
const service = new ScreenRecorderService();
export default service;
