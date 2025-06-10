import { Component, inject, input, OnDestroy } from "@angular/core";
import { HotmService } from "./hotm.service";
import { BaseNode, castToLevelable } from "./hotm.model";
import { Button } from "primeng/button";
import { ColorizePipe } from "../../pipes/colorize.pipe";
import { ParseMCPipe } from "../../pipes/parse-mc.pipe";
import { SafeHtmlPipe } from "primeng/menu";
import { Toast } from "primeng/toast";
import { MessageService } from "primeng/api";
import { formattedPowderString, getNameById, Status } from "./hotmData";
import { Slider } from "primeng/slider";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "sb-hotm-card",
  imports: [
    Button,
    ColorizePipe,
    ParseMCPipe,
    SafeHtmlPipe,
    Toast,
    Slider,
    FormsModule,
  ],
  template: `
    @let levInst = castToLevelable(instance());
    <div class="flex flex-col items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="font-semibold text-lg">
          {{ instance().name }}
        </div>
        @if (isLevelable()) {
          <div>
            <span class="mc gray">Level {{ levInst.currentLevel() }}</span>
            <span class="mc darkgray">/{{ levInst.maxLevel }}</span>
          </div>
        }
      </div>
      <hr
        class="w-[66%] h-[3px] mx-auto my-2 bg-gray-500/40 border-0 rounded-sm "
      />
      <div class="flex flex-row">
        @if (isLevelable()) {
          <span
            class="whitespace-normal break-words"
            [innerHTML]="
              levInst.formattedDescription() | colorize | parse | safeHtml
            "
          ></span>
        } @else {
          <span
            class="whitespace-normal break-words"
            [innerHTML]="instance().description | colorize | parse | safeHtml"
          ></span>
        }
      </div>
      <div class="flex justify-center my-2 w-full">
        @if (instance().status() === Status.LOCKED) {
          <p-button severity="primary" (onClick)="enforceOpenRequirement()">
            Open Perk
          </p-button>
        } @else {
          @if (isLevelable()) {
            <div class="flex flex-col items-center w-full">
              <div class="mb-2">
                Cost:
                <span
                  [innerHTML]="
                    formattedPowderString(
                      levInst.powderAmount,
                      levInst.powderType
                    )
                      | colorize
                      | parse
                      | safeHtml
                  "
                ></span>
              </div>
              <div class="mb-2">
                Total:
                <span
                  [innerHTML]="
                    formattedPowderString(
                      levInst.totalPowderAmount,
                      levInst.powderType
                    )
                      | colorize
                      | parse
                      | safeHtml
                  "
                ></span>
              </div>
              <div class="mx-8 w-[95%] my-2">
                <p-slider
                  [(ngModel)]="levInst.currentLevel"
                  [min]="1"
                  [max]="levInst.maxLevel"
                  [step]="1"
                />
              </div>
            </div>
          }
        }
      </div>
    </div>
    <p-toast
      [breakpoints]="{ '920px': { width: '90%', right: '-5%', left: '5%' } }"
    ></p-toast>
  `,
  providers: [MessageService],
})
export class CardComponent implements OnDestroy {
  instance = input.required<BaseNode>();
  isLevelable = input.required<boolean>();

  hotmServ = inject(HotmService);
  msgServ = inject(MessageService);

  enforceOpenRequirement() {
    if (this.hotmServ.freeMode) {
      this.instance().onNodeOpened();
      this.hotmServ.usedTokens++;
      return;
    }

    const reqs = this.instance().requires;
    // Open if no requirements or if one of the requirements is unlocked
    if (
      reqs.length === 0 ||
      reqs.some((req) => this.hotmServ.getOpenIds().includes(req))
    ) {
      if (this.hotmServ.usedTokens < this.hotmServ.strictAllowedTokens) {
        this.hotmServ.usedTokens++;
        this.instance().onNodeOpened();
      }
    } else {
      this.msgServ.add({
        severity: "error",
        summary: "Requirement(s) not met!",
        detail: `You need to unlock one of the following perks: ${reqs.map((req) => getNameById(req)).join(", ")}`,
      });
    }
  }

  protected readonly Status = Status;
  protected readonly castToLevelable = castToLevelable;
  protected readonly formattedPowderString = formattedPowderString;

  ngOnDestroy() {
    // Clear any pending messages
    this.msgServ.clear();
  }
}
