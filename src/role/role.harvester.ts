// Harvester（エネルギー採取＋供給役）の状態を定義
export enum HarvesterState {
  Harvesting = "harvesting",   // エネルギー採取中
  Transfering = "transfering", // エネルギー供給中
}

// Harvester のロールクラス定義
export class RoleHarvester {
  private creep: Creep;

  constructor(creep: Creep) {
    this.creep = creep;
  }

  // 毎tick実行されるエントリーポイント
  public run() {
    this.updateState(); // 状態（採取 or 輸送）を更新

    // 状態に応じた処理を実行
    switch (this.creep.memory.state) {
      case HarvesterState.Harvesting:
        this.harvest();
        break;
      case HarvesterState.Transfering:
        this.transfer();
        break;
    }
  }

  // 状態をエネルギー量に基づいて更新
  private updateState() {
    if (this.creep.store[RESOURCE_ENERGY] === 0) {
      // エネルギー切れ → 採取モード
      this.creep.memory.state = HarvesterState.Harvesting;
      this.creep.say("🔄 harvest");
    } else if (this.creep.store.getFreeCapacity() === 0) {
      // エネルギー満タン → 輸送モード
      this.creep.memory.state = HarvesterState.Transfering;
      this.creep.say("📤 transfer");
    }
  }

  // エネルギー採取処理
  private harvest() {
    const source = this.creep.pos.findClosestByPath(FIND_SOURCES);
    if (source && this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(source, {
        visualizePathStyle: { stroke: "#ffaa00" }, // 視覚化
      });
    }
  }

  // エネルギーをSpawnかExtensionに輸送する処理
  private transfer() {
    const target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure: AnyStructure) => {
        return (
          (structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_EXTENSION) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });

    if (target && this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target, {
        visualizePathStyle: { stroke: "#ffffff" }, // 視覚化
      });
    }
  }
}
