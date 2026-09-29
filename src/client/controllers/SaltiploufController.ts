import { EventBus } from "../../core/EventBus";
import { UnitType } from "../../core/game/Game";
import { GameUpdateType } from "../../core/game/GameUpdates";
import { Controller } from "../Controller";
import { GameView, UnitView } from "../view";
import {
  showToast,
  translateText,
} from "../Utils";

export class SaltiploufController implements Controller {
  constructor(
    private readonly game: GameView,
    private readonly eventBus: EventBus,
  ) {}

  tick(): void {
    const updates = this.game.updatesSinceLastTick();
    if (!updates) return;

    for (const u of updates[GameUpdateType.Unit] ?? []) {
      const unit = this.game.unit(u.id);
      if (unit === undefined) continue;
      this.handleUnit(unit);
    }
  }

  private handleUnit(unit: UnitView): void {
    if (unit.isActive() && unit.createdAt() === this.game.ticks()) {
      this.onCreated(unit);
    }
  }

  private onCreated(unit: UnitView): void {
    const myPlayer = this.game.myPlayer()
    if (!myPlayer) return;
    const owner = unit.owner();
    if (owner === myPlayer) return;

    const myTeam = myPlayer.team();
    if (myTeam !== null && owner.team() === myTeam) return;

    switch (unit.type()) {
      case UnitType.SAMLauncher:
        showToast(
          translateText("saltiplouf.sam_placed", { player: owner.name() }),
          "red",
          5000
        );
        break;
      case UnitType.MissileSilo:
        showToast(
          translateText("saltiplouf.missile_silo_placed", { player: owner.name() }),
          "red",
          10000
        );
        break;
      case UnitType.Warship:
        showToast(
          translateText("saltiplouf.warship_placed", { player: owner.name() }),
          "red",
          3000
        );
        break;
    }
  }
}
