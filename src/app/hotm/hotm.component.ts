import { Component, inject, signal, WritableSignal } from "@angular/core";
import { formattedPowderNumber, Position, PowderType } from "./hotmData";
import { Nullable } from "../../interfaces/types";
import { NgClass } from "@angular/common";
import { HotmService } from "./hotm.service";
import { CardComponent } from "./card.component";
import { DialogService } from "primeng/dynamicdialog";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { Button } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";

@Component({
  selector: "sb-hotm",
  templateUrl: "./hotm.component.html",
  styleUrl: "./hotm.component.scss",
  imports: [NgClass, CardComponent, FormsModule],
  providers: [DialogService],
})
export class HotmComponent {
  hotmServ = inject(HotmService);
  selectedPos: WritableSignal<Nullable<Position>> = signal(null);

  dialogVisible = false;

  // Click handlers

  onCellClick(x: number, y: number) {
    this.selectedPos.set({ x, y });
  }

  openDialog() {
    this.dialogVisible = true;
  }

  //#region Load from backend
  // Profile stuffs
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
  //#endregion

  protected readonly format = formattedPowderNumber;
  protected readonly PowderType = PowderType;
}

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
