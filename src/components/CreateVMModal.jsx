import React, { Fragment, useState } from "react";
import { Modal, ModalVariant, Button, Form, FormGroup, Popover, TextInput, FormSelect, FormSelectOption } from "@patternfly/react-core";
import VM from "../models/VM";

export default function CreateVMModal({ isOpen, onClose, handleToggle, getVms, createVm }) {
    const [name, setName] = useState("");
    const [cpuCount, setCpuCount] = useState(2);
    const [primaryMemory, setPrimaryMemory] = useState(1024);
    const [vram, setVram] = useState(64);

    const handleNameChange = value => setName(value);
    const handleCpuCountChange = value => setCpuCount(value);
    const handlePrimaryMemoryChange = value => setPrimaryMemory(value);
    const handleVramChange = value => setVram(value);
    const handleSubmit = event => {
        handleToggle();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        const vm = new VM(data.name, data.os_type, null, null, primaryMemory, cpuCount, vram);
        createVm(vm);
        console.log(vm);
        // reset details
        setName("");
        setCpuCount(2);
        setPrimaryMemory(1024);
        setVram(64);
    };

    return (
        <Modal
            variant="large" title="Create Virtual Machine"
            isOpen={isOpen} onClose={onClose}
            actions={[
                <Button key="Create" variant="primary" form="create-vm-form" type="submit">
                    Create
                </Button>,
                <Button key="Cancel" variant="primary" form="create-vm-form" onClick={handleToggle}>
                    Cancel
                </Button>
            ]}
        >
            <Form id="create-vm-form" onSubmit={handleSubmit}>
                <FormGroup label="Name">
                    <TextInput isRequired type="text" name="name" value={name} onChange={handleNameChange} />
                </FormGroup>
                <FormGroup label="OS Type">
                    <SelectOS />
                </FormGroup>
                <FormGroup label="CPU">
                    <TextInput isRequired type="number" name="cpuCount" value={cpuCount} onChange={handleCpuCountChange} />
                </FormGroup>
                <FormGroup label="Primary memory">
                    <TextInput isRequired type="number" name="primaryMemory" value={primaryMemory} onChange={handlePrimaryMemoryChange} />
                </FormGroup>
                <FormGroup label="Video memory">
                    <TextInput isRequired type="number" name="vram" value={vram} onChange={handleVramChange} />
                </FormGroup>
            </Form>
        </Modal>
    );
}

function SelectOS(props) {
    const [selectedValue, setSelectedValue] = useState("Ubuntu_64");
    const onChange = value => setSelectedValue(value);

    const options = [{
        value: "Select an OS type",
        label: "OS Type",
        disabled: true
    }, {
        value: "Ubuntu_64",
        label: "Ubuntu64",
        disabled: false
    }, {
        value: "Fedora_64",
        label: "Fedora64",
        disabled: false
    }];

    return (
        <FormSelect value={selectedValue} onChange={onChange} aria-label="FormSelect Input" name="os_type">
            { options.map((option, index) => (
                <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.value} />
            )) }
        </FormSelect>
    );
}
