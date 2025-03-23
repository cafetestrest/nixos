import { bind } from "astal";
import { Gtk } from "astal/gtk3";
import NightlightToggle from "./NightlightToggle";
import IdleToggle from "./IdleToggle";
import {
  qsTogglesPage,
  qsRevertRevealerStatus,
  qsTogglesSpacing,
  qsRowSpacing,
  maxItemsPerRowQSToggles,
  maxItemsPerColumnQSToggles,
  qsShowToggles
} from "../../common/Variables";
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

function QSEmptyButton() {
  return (
    <box className={"toggles empty"}/>
  );
}

const allToggles = [
  { "BluetoothToggle": BluetoothToggle() },
  { "NightlightToggle": NightlightToggle() },
  { "MicrophoneToggle": MicrophoneToggle() },
  { "ScreenshotToggle": ScreenshotToggle(), "QSScreenshotMenu": QSScreenshotMenu() },
  { "IdleToggle": IdleToggle() },
  { "LightstripToggle": LightstripToggle(), "QSLightstripMenu": QSLightstripMenu() },
  { "NetworkToggle": NetworkToggle() },
  { "ScreenRecordToggle": ScreenRecordToggle(), "QSScreenRecordMenu": QSScreenRecordMenu() },
  { "DNDToggle": DNDToggle() },
  { "ColorPickerToggle": ColorPickerToggle() },
  { "NoteToggle": NoteToggle() },
  { "ColorToggle": ColorToggle() },
  // { "QSEmptyButton": QSEmptyButton() }, // enable if you have odd number of toggles
];

// Function to split the array into rows
const splitIntoRows = (toggles, itemsPerRow) => {
  const rows = [];
  for (let i = 0; i < toggles.length; i += itemsPerRow) {
    rows.push(toggles.slice(i, i + itemsPerRow));
  }

  return rows;
};

// Function to split the array into pages
const splitIntoPages = (toggles, itemsPerPage) => {
  const pages = [];
  for (let i = 0; i < toggles.length; i += itemsPerPage) {
    pages.push(toggles.slice(i, i + itemsPerPage));
  }

  return pages;
};

// Split toggles into rows and pages
const toggleRows = splitIntoRows(allToggles, maxItemsPerRowQSToggles);
const togglePages = splitIntoPages(toggleRows, maxItemsPerColumnQSToggles);

// Render a single row of toggles
const renderRow = (rowToggles) => {
  return (
    <box
      spacing={qsTogglesSpacing}
    >
      {rowToggles.map((toggle) => {
        const toggleIdentifier = Object.keys(toggle)[0];
        return toggle[toggleIdentifier];
      })}
    </box>
  );
};

// menus that are inside pages
const renderMenu = (rowToggles, rowIndex) => {
  return (
    <box vertical={true}>
      {rowToggles.map((toggle) => {
        const keys = Object.keys(toggle);
        if (keys.length > 1 && rowIndex !== maxItemsPerColumnQSToggles - 1) {
          const toggleIdentifier = Object.keys(toggle)[1];
          return toggle[toggleIdentifier];
        }
      })}
    </box>
  );
};

// menus that are outside pages, last item on the page
const renderMenuOutsideToggles = (pageRows) => {
  return pageRows.map((rowToggles, rowIndex) => {
    return (
      <box
        vertical={true}
      >
        {rowToggles.map((toggle) => {
          const keys = Object.keys(toggle);
          if (keys.length > 1 && rowIndex === maxItemsPerColumnQSToggles - 1) {
            const toggleIdentifier = Object.keys(toggle)[1];
            return toggle[toggleIdentifier];
          }
        })}
      </box>
    );
  });
};

// Render a single page of toggles
const renderPage = (pageRows, pageIndex) => {
  return (
    <box
      className={"qs-toggles-page"}
      name={`qs-page-${pageIndex}`}
      vertical={true}
      spacing={qsRowSpacing}
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

const QSToggles = () => {
  if (qsShowToggles === false) {
    return (
        <box visible={false} />
    );
  }

  return (
    <box
      className={"qs-toggles"}
      vertical={true}
    >
      <stack
        visibleChildName={bind(qsTogglesPage)}
        transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
        children={
          togglePages.map((page, pageIndex) => {
            return renderPage(page, pageIndex);
          })
        }
      />

      {renderMenuOutsideToggles(toggleRows)}

      <box
        halign={Gtk.Align.CENTER}
        className={"qs-pages-box"}
      >
        {togglePages.map((_, pageIndex) => {
          const pageName = `qs-page-${pageIndex}`;
          return (
            <button
              className={bind(qsTogglesPage).as((page) => {
                return page === pageName ? "workspace-button active" : "workspace-button";
              })}
              onClicked={() => {
                qsRevertRevealerStatus("");
                qsTogglesPage.set(pageName);
              }}
            >
              <box className={"workspace-dot"}/>
            </button>
          );
        })}
      </box>
    </box>
  );
};

export default QSToggles;
