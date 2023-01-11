import { Button } from '@patternfly/react-core';
import React from 'react';
import cockpit from 'cockpit';

export function VMList({ vms, deleteVm }) {
    return (
        <ul>
            { vms && vms.map(vm => (
                <li key={vm.name}>
                    { vm.name }
                    <Button variant='danger' onClick={() => deleteVm(vm)}>Delete</Button>
                </li>
            ))}
        </ul>
    );
}
