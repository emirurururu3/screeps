// Upgrader（コントローラーをアップグレードする役割）の状態を定義
export enum UpgraderState {
  Harvesting = "harvesting", // エネルギーを採取中
  Upgrading = "upgrading",   // コントローラーをアップグレード中
}

// Upgraderロールのクラス定義
export class RoleUpgrader {
  private creep: Creep;

  constructor(creep: Creep) {
    this.creep = creep;
  }

  // 毎tick呼び出されるエントリーポイント
  public run() {
    this.updateState(); // 状態を現在のエネルギー状況から判断・更新

    // 状態に応じて処理を分岐
    switch (this.creep.memory.state) {
      case UpgraderState.Harvesting:
        this.harvest();
        break;
      case UpgraderState.Upgrading:
        this.upgrade();
        break;
    }
  }

  // 現在のエネルギー量に応じて状態を更新
  private updateState() {
    if (this.creep.store[RESOURCE_ENERGY] === 0) {
      // エネルギーが空 → 採取状態に遷移
      this.creep.memory.state = UpgraderState.Harvesting;
      this.creep.say("🔄 harvest");
    } else if (this.creep.store.getFreeCapacity() === 0) {
      // エネルギーが満タン → アップグレード状態に遷移
      this.creep.memory.state = UpgraderState.Upgrading;
      this.creep.say("⚡ upgrade");
    }
  }

  // エネルギー源からエネルギーを採取する処理
  private harvest() {
    const source = this.creep.pos.findClosestByPath(FIND_SOURCES);
    if (source && this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(source, {
        visualizePathStyle: { stroke: "#ffaa00" }, // 経路を視覚化
      });
    }
  }

  // コントローラーをアップグレードする処理
  private upgrade() {
    const controller = this.creep.room.controller;
    if (controller && this.creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(controller, {
        visualizePathStyle: { stroke: "#ffffff" }, // 経路を視覚化
      });
    }
  }
}
