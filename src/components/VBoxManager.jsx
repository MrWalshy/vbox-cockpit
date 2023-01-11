import React, { useEffect, useState } from 'react';
import { VMList } from './VMList.jsx';
import cockpit from 'cockpit';
import VM from '../models/VM';
import CreateVMModal from './CreateVMModal.jsx';
import { Button } from '@patternfly/react-core';

export function VBoxManager(props) {
    const [vms, setVms] = useState([]);
    const [error, setError] = useState(false);
    const [isCreateVmModalOpen, setCreateVmModalOpen] = useState(false);

    const handleCreateVmModalToggle = () => setCreateVmModalOpen(!isCreateVmModalOpen);

    function handleGetVms(data) {
        const vmList = [];
        const lines = data.split("\n");
        lines.forEach(line => {
            if (line.trim().length !== 0) {
                const splitLine = line.split(" ");
                const vm = new VM(splitLine[0].substring(1, splitLine[0].length - 1), null, null, splitLine[1]);
                vmList.push(vm);
            }
        });
        setVms(vmList);
    }

    function getVms() {
        cockpit.spawn(["vboxmanage", "list", "vms"])
                .stream(handleGetVms)
                .catch(err => {
                    console.log(err);
                    setError(true);
                });
    }

    function createVm(vm) {
        if (!vm.name || vm.name.trim("").length === 0) throw new Error("Property not supplied: 'name' is a requirement for deleting a VM");
        cockpit.spawn(["vboxmanage", "createvm", "--name", vm.name, "--ostype", vm.osType, "--register"])
                .then(() => {
                    applyVmConfiguration(vm);
                    setVms(previousState => [...previousState, vm]);
                })
                .catch(error => console.error(error));
    }

    function applyVmConfiguration(vm) {
        // handle creating the VMS configuration
        const command = ["vboxmanage", "modifyvm", vm.name, "--nic1", "bridged", "--bridgeadapter1", "wlp6s0"];
        if (vm.cpuCount) command.push("--cpus=" + vm.cpuCount);
        if (vm.primaryMemory) command.push("--memory=" + vm.primaryMemory);
        if (vm.vram) command.push("--vram=" + vm.vram);
        cockpit.spawn(command)
                .stream(data => console.log(data))
                .catch(error => console.error(error));
    }

    function deleteVm(vm) {
        if (!vm.name || vm.name.trim("").length === 0) throw new Error("Property not supplied: 'name' is a requirement for deleting a VM");
        cockpit.spawn(["vboxmanage", "unregistervm", "--delete", vm.name])
                .then(() => {
                    if (vms.indexOf(vm) !== -1) {
                        setVms(prev => prev.filter(virt => virt.name !== vm.name));
                    }
                });
    }

    // Initial render of VMS
    useEffect(() => getVms(), []);

    return (
        <main tabIndex={-1}>
            <section>
                <h1>VBox Manager</h1>
                <div id="button-bar">
                    <Button variant='primary' onClick={handleCreateVmModalToggle}>
                        Create VM
                    </Button>
                </div>

                { vms && <VMList vms={vms} deleteVm={deleteVm} /> }
                <CreateVMModal isOpen={isCreateVmModalOpen} onClose={handleCreateVmModalToggle} handleToggle={handleCreateVmModalToggle} getVms={getVms} createVm={createVm} />
            </section>
        </main>
    );
}
