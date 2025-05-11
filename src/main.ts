import { ErrorMapper } from "utils/ErrorMapper";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: string;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

import roleHarvester from "role/role.harvester";

const HARVESTER_NUM = 2;
const UPGRADER_NUM = 2;


export const loop = ErrorMapper.wrapLoop(() => {
  var harvesters = _.filter(Game.creeps, (x) => x.memory.role == "harvester");
  var upgraders = _.filter(Game.creeps, (x) => x.memory.role == "upgrader");
  var spawn = Game.spawns["Spawn1"];
  console.log(harvesters.length);

 //ハーベスター作成
  if (harvesters.length < HARVESTER_NUM){
    console.log("aaa");
  let newName = "Harvester" + Game.time;
  spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: {
    role: 'harvester',
    room: "",
    working: ""
  } });
  }
// //アップグレーダー作成
//     if(upgraders.length<UPGRADER_NUM){
//     let newName = "upgrader" + Game.time;
//     Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName,  { memory: {
//       role: 'upgrader',
//       room: "",
//       working: ""
//     } });
//   }

for(var name in Game.creeps){
  var creep = Game.creeps[name];
  if(creep.memory.role=="harvester"){
    roleHarvester.run(creep);
  }
}

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
