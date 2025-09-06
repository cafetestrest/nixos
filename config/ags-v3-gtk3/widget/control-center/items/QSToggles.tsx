import { Gtk } from "ags/gtk3";
import NightlightToggle from "./NightlightToggle";
import IdleToggle from "./IdleToggle";
import {
  qsTogglesPage,
  setQsTogglesPage,
  qsRevertRevealerStatus,
  config
} from "../../../lib/config";
import MicrophoneToggle from "./MicrophoneToggle";
import DNDToggle from "./DNDToggle";
import BluetoothToggle from "./BluetoothToggle";
import ScreenRecordToggle from "./ScreenRecordToggle";
import QSScreenRecordMenu from "../menu/QSScreenRecordMenu";
import NetworkToggle from "./NetworkToggle";
import ScreenshotToggle from "./ScreenshotToggle";
import QSScreenshotMenu from "../menu/QSScreenshotMenu";
import LightstripToggle from "./LightstripToggle";
import QSLightstripMenu from "../menu/QSLightstripMenu";
import ColorPickerToggle from "./ColorPickerToggle";
import NoteToggle from "./NoteToggle";
import ColorToggle from "./ColorToggle";

const QSToggles = () => {
  function QSEmptyButton() {
    return (
      <box class={"toggles empty"}/>
    );
  }

  const allToggles = [];

  for (const toggleKey of config.qs.qsToggles) {
    switch (toggleKey) {
      case "BluetoothToggle":
        allToggles.push({ toggleKey: BluetoothToggle() });
        break;
      case "NightlightToggle":
        allToggles.push({ toggleKey: NightlightToggle() });
        break;
      case "MicrophoneToggle":
        allToggles.push({ toggleKey: MicrophoneToggle() });
        break;
      case "ScreenshotToggle":
        allToggles.push({ toggleKey: ScreenshotToggle(), "QSScreenshotMenu": QSScreenshotMenu() });
        break;
      case "IdleToggle":
        allToggles.push({ toggleKey: IdleToggle() });
        break;
      case "LightstripToggle":
        allToggles.push({ toggleKey: LightstripToggle(), "QSLightstripMenu": QSLightstripMenu() });
        break;
      case "NetworkToggle":
        allToggles.push({ toggleKey: NetworkToggle() });
        break;
      case "ScreenRecordToggle":
        allToggles.push({ toggleKey: ScreenRecordToggle(), "QSScreenRecordMenu": QSScreenRecordMenu() });
        break;
      case "DNDToggle":
        allToggles.push({ toggleKey: DNDToggle() });
        break;
      case "ColorPickerToggle":
        allToggles.push({ toggleKey: ColorPickerToggle() });
        break;
      case "NoteToggle":
        allToggles.push({ toggleKey: NoteToggle() });
        break;
      case "ColorToggle":
        allToggles.push({ toggleKey: ColorToggle() });
        break;
      case "QSEmptyButton":
        allToggles.push({ toggleKey: QSEmptyButton() });
        break;
      default:
        break;
    }
  }

type TogglesType = Record<string, JSX.Element>;

  // Function to split the array into rows
  const splitIntoRows = (toggles: TogglesType[], itemsPerRow: number) => {
    const rows = [];
    for (let i = 0; i < toggles.length; i += itemsPerRow) {
      rows.push(toggles.slice(i, i + itemsPerRow));
    }

    return rows;
  };

  // Function to split the array into pages
  const splitIntoPages = (toggles: TogglesType[][], itemsPerPage: number) => {
    const pages = [];
    for (let i = 0; i < toggles.length; i += itemsPerPage) {
      pages.push(toggles.slice(i, i + itemsPerPage));
    }

    return pages;
  };

  // Split toggles into rows and pages
  const toggleRows = splitIntoRows(allToggles, config.qs.maxItemsPerRowQSToggles);
  const togglePages = splitIntoPages(toggleRows, config.qs.maxItemsPerColumnQSToggles);

  // Render a single row of toggles
  const renderRow = (rowToggles: TogglesType[]) => {
    return (
      <box
        spacing={config.qs.qsTogglesSpacing}
      >
        {rowToggles.map((toggle) => {
          const toggleIdentifier = Object.keys(toggle)[0];
          return toggle[toggleIdentifier];
        })}
      </box>
    );
  };

  // menus that are inside pages
  const renderMenu = (rowToggles: TogglesType[], rowIndex: number) => {
    return (
      <box vertical={true}>
        {rowToggles.map((toggle) => {
          const keys = Object.keys(toggle);
          if (keys.length > 1 && rowIndex !== config.qs.maxItemsPerColumnQSToggles - 1) {
            const toggleIdentifier = Object.keys(toggle)[1];
            return toggle[toggleIdentifier];
          }
        })}
      </box>
    );
  };

  // menus that are outside pages, last item on the page
  const renderMenuOutsideToggles = (pageRows: TogglesType[][]) => {
    return pageRows.map((rowToggles, rowIndex) => {
      return (
        <box
          vertical={true}
        >
          {rowToggles.map((toggle) => {
            const keys = Object.keys(toggle);
            if (keys.length > 1 && rowIndex === config.qs.maxItemsPerColumnQSToggles - 1) {
              const toggleIdentifier = Object.keys(toggle)[1];
              return toggle[toggleIdentifier];
            }
          })}
        </box>
      );
    });
  };

  // Render a single page of toggles
  const renderPage = (pageRows: TogglesType[][], pageIndex: number) => {
    return (
      <box
        class={"qs-toggles-page"}
        name={`qs-page-${pageIndex}`}
        vertical={true}
        spacing={config.qs.qsRowSpacing}
        $type="named"
      >
        {pageRows.map((row, rowIndex) => {
          return (
            <box
              vertical={true}
              children={[
                renderRow(row),
                renderMenu(row, rowIndex),
              ]}
            />
          );
        })}
      </box>
    );
  };

  if (config.qs.qsShowToggles === false) {
    return (
        <box visible={false} />
    );
  }

  return (
    <box
      class={"qs-toggles"}
      vertical={true}
    >
      <stack
        visibleChildName={qsTogglesPage}
        transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
        children={
          togglePages.map((page, pageIndex) =>
            renderPage(page, pageIndex) as unknown as Gtk.Widget
          )
        }
      />

      {renderMenuOutsideToggles(toggleRows)}

      <box
        halign={Gtk.Align.CENTER}
        class={"qs-pages-box"}
      >
        {togglePages.map((_, pageIndex) => {
          const pageName = `qs-page-${pageIndex}`;
          return (
            <button
              class={qsTogglesPage.as((page) => {
                return page === pageName ? "workspace-button active" : "workspace-button";
              })}
              onClicked={() => {
                qsRevertRevealerStatus("");
                setQsTogglesPage(pageName);
              }}
            >
              <box class={"workspace-dot"}/>
            </button>
          );
        })}
      </box>
    </box>
  );
};

export default QSToggles;
