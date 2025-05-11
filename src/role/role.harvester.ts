var roleHarvester = {
    run: function(creep: Creep){
        if(creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()){
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(source&&creep.harvest(source) == ERR_NOT_IN_RANGE){
                creep.moveTo(source);
            }
        }
        else{
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure: AnyStructure) =>{
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION) &&
                       (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            }
            });

            if(target){
                if(creep.transfer(target, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }
        }
    }
};

export default roleHarvester;
