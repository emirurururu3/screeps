// Builder の状態を列挙型で定義
export enum BuilderState {
  Harvesting = "harvesting",   // エネルギーを採取中
  Building = "building",       // 建設中
  Transfering = "transfering", // エネルギーを他構造物に輸送中
}

// Builder の役割を担うクラス
export class RoleBuilder {
  private creep: Creep;

  constructor(creep: Creep) {
    this.creep = creep;
  }

  // 毎tick実行されるメイン処理
  public run() {
    this.updateState(); // 現在の状態を更新

    // 状態に応じたアクションを実行
    switch (this.creep.memory.state) {
      case BuilderState.Harvesting:
        this.harvest();
        break;
      case BuilderState.Building:
        this.build();
        break;
      case BuilderState.Transfering:
        this.transfer();
        break;
    }
  }

  // エネルギー量や建設予定地の有無に応じて状態を更新
  private updateState() {
    const constructionSites = this.creep.room.find(FIND_CONSTRUCTION_SITES);

    if (this.creep.store[RESOURCE_ENERGY] === 0) {
      // エネルギー切れ → 採取モード
      this.creep.memory.state = BuilderState.Harvesting;
      this.creep.say("🔄 harvest");
    } else if (this.creep.store.getFreeCapacity() === 0) {
      if (constructionSites.length > 0) {
        // エネルギー満タン & 建設予定あり → 建築モード
        this.creep.memory.state = BuilderState.Building;
        this.creep.say("🚧 build");
      } else {
        // エネルギー満タン & 建設予定なし → 輸送モード
        this.creep.memory.state = BuilderState.Transfering;
        this.creep.say("📤 transfer");
      }
    }
  }

  // エネルギー採取処理
  private harvest() {
    const source = this.creep.pos.findClosestByPath(FIND_SOURCES);
    if (source && this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(source);
    }
  }

  // エネルギーをSpawnやExtensionに輸送する処理
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

    // 輸送処理（移動含む）
    if (target && this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target, {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
    }
  }

  // 建設処理（最寄りの建設予定地を対象）
  private build() {
    const target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (target) {
      if (this.creep.build(target) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    }
  }
}
