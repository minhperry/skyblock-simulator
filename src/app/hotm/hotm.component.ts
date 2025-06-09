import { Component, inject, signal, WritableSignal } from "@angular/core";
import { formattedPowderNumber, Position, Status } from "./hotmData";
import { Nullable } from "../../interfaces/types";
import { NgClass } from "@angular/common";
import { HotmService } from "./hotm.service";
import { CardComponent } from "./card.component";
import { DialogService } from "primeng/dynamicdialog";
import { FormsModule } from "@angular/forms";
import { Select } from "primeng/select";
import { LevelableNode, StaticNode } from "./hotm.model";
import { Clipboard } from "@angular/cdk/clipboard";
import { Toast } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
  selector: "sb-hotm",
  templateUrl: "./hotm.component.html",
  styleUrl: "./hotm.component.scss",
  imports: [NgClass, CardComponent, FormsModule, Select, Toast],
  providers: [DialogService, MessageService],
})
export class HotmComponent {
  protected hotmServ = inject(HotmService);
  protected clipboard = inject(Clipboard);
  protected msg = inject(MessageService);
  selectedPos: WritableSignal<Nullable<Position>> = signal(null);

  dialogVisible = false;

  predefinedTrees = [
    { label: "Powder Grinder", value: "powder_grinder" },
    { label: "Mithril Miner", value: "mithril_miner" },
    { label: "Gemstone Grinder", value: "gemstone_grinder" },
    { label: "Balanced Setup", value: "balanced_setup" },
  ];

  // Click handlers

  onCellClick(x: number, y: number) {
    this.selectedPos.set({ x, y });
  }

  openDialog() {
    this.dialogVisible = true;
  }

  //#region Load from backend
  /* Profile stuffs
  ign = "";
  profiles: Profile[] = [];
  selectedProfile = this.profiles[0];

  selectDisabled = true;

  http = inject(HttpClient);
  backend = environment.backendUrl;

  submitUsername() {
    //this.profiles = []
    this.http
      .get<ProfileResponse[]>(this.backend + "/profiles/" + this.ign)
      .subscribe({
        next: (val: ProfileResponse[]) => {
          for (const prof of val) {
            const profile = responseToProfileMapper(prof);
            this.profiles.push(profile);
          }
          this.selectDisabled = false;
          console.log(this.profiles);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  */

  //#endregion

  onExportClick() {
    const exportData: string[] = [];
    for (const row of this.hotmServ.grid) {
      for (const cell of row) {
        if (!cell) continue;
        const status = cell.status();
        const pos = `${cell.position.x},${cell.position.y}`;
        if (cell instanceof LevelableNode) {
          if (status !== Status.LOCKED) exportData.push(`${pos}:${cell.currentLevel()}`);
        } else if (cell instanceof StaticNode) {
          if (status !== Status.LOCKED) exportData.push(`${pos}`);
        } else {
          if (status !== Status.LOCKED) exportData.push(`${pos}`);
        }
      }
    }
    this.clipboard.copy(JSON.stringify(exportData));
  }

  onImportClick() {
    navigator.clipboard.readText().then((text) => {
      try {
        const importData = JSON.parse(text) as string[];
        for (const str of importData) {
          const match = str.match(/^(?<x>\d+),(?<y>\d+)(:(?<level>\d+))?$/);

          if (!match || !match.groups) {
            this.msg.add({
              severity: "error",
              summary: "Invalid import format!",
              detail: `The format "${str}" does not match the expected pattern.`
            });
            continue;
          }

          const x = parseInt(match.groups["x"], 10);
          const y = parseInt(match.groups["y"], 10);
          const level = match.groups["level"] ? parseInt(match.groups["level"], 10) : -1; // -1 for static nodes and abilities

          const node = this.hotmServ.grid[y][x];

          if (node instanceof LevelableNode) {
            node.currentLevel.set(level);
            console.log("Opened levelable node at", x, y, "with level", level);
          } else {
            node.onNodeOpened();
          }
        }
      } catch {
        this.msg.add({
          severity: "error",
          summary: "Import failed!",
          detail: "The clipboard content is not valid JSON or does not match the expected format."
        });
        console.error("Import failed: Invalid JSON or format", text);
      }
    });
  }

  protected readonly format = formattedPowderNumber;
}

/*
function responseToProfileMapper(prof: ProfileResponse): Profile {
  let icon = "";
  switch (prof.gameMode) {
    case "ironman":
      icon = "♻";
      break;
    case "bingo":
      icon = "Ⓑ"; // letter B in circle
      break;
    case "island":
      icon = "☀";
      break;
  }
  return {
    displayName: `${prof.active ? ">>>" : ""} ${icon} ${prof.profileFruit}`,
    uuid: prof.profileId,
  };
}

interface Profile {
  displayName: string;
  uuid: string;
}

interface ProfileResponse {
  active: boolean;
  gameMode: "normal" | "ironman" | "bingo" | "island";
  profileFruit: string;
  profileId: string;
}
*/