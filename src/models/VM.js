export default class VM {
    id;
    name;
    osType;
    cpuCount;
    primaryMemory;
    secondaryMemory;
    vram;

    constructor(name = "", osType = "", secondaryMemory = null, id = "", primaryMemory = null, cpuCount = null, vram = null) {
        this.id = id;
        this.name = name;
        this.osType = osType;
        this.cpuCount = cpuCount;
        this.primaryMemory = primaryMemory;
        this.secondaryMemory = secondaryMemory;
        this.vram = vram;
    }
}
