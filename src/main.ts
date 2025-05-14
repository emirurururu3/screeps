import { ErrorMapper } from "utils/ErrorMapper";

declare global {
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    state: string;
  }

  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// 各ロールのクラスと状態をインポート
import { RoleHarvester, HarvesterState } from "role/role.harvester";
import { RoleUpgrader, UpgraderState } from "role/role.upgrader";
import { RoleBuilder, BuilderState } from "role/role.builder";

// 各ロールの目標数を定義
const HARVESTER_NUM = 2;
const UPGRADER_NUM = 2;
const BUILDER_NUM = 1; // 追加

// メインループ（毎tick実行）
export const loop = ErrorMapper.wrapLoop(() => {
  // それぞれの役割を持つクリープを抽出
  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === "harvester");
  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === "upgrader");
  const builders = _.filter(Game.creeps, (creep) => creep.memory.role === "builder");

  const spawn = Game.spawns["Spawn1"];

  // ハーベスターの生成
  if (harvesters.length < HARVESTER_NUM) {
    const newName = "Harvester" + Game.time;
    spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: {
        role: "harvester",
        room: "",
        state: HarvesterState.Harvesting,
      },
    });
  }

  // アップグレーダーの生成
  if (upgraders.length < UPGRADER_NUM) {
    const newName = "Upgrader" + Game.time;
    spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: {
        role: "upgrader",
        room: "",
        state: UpgraderState.Harvesting,
      },
    });
  }

  // ビルダーの生成（追加）
  if (builders.length < BUILDER_NUM) {
    const newName = "Builder" + Game.time;
    spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: {
        role: "builder",
        room: "",
        state: BuilderState.Harvesting,
      },
    });
  }

  // 全クリープに対してロールごとの処理を実行
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];

    if (creep.memory.role === "harvester") {
      new RoleHarvester(creep).run();
    } else if (creep.memory.role === "upgrader") {
      new RoleUpgrader(creep).run();
    } else if (creep.memory.role === "builder") {
      new RoleBuilder(creep).run();
    }
  }

  // メモリ上に存在していてゲーム上には存在しないクリープを削除
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
