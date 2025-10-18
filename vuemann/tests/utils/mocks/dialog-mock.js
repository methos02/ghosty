import { vi } from 'vitest';


export const initDialogFunctions = () => {
    HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    HTMLDialogElement.prototype.close = function () { this.open = false; };
    
    return { 
        showModalSpy : vi.spyOn(HTMLDialogElement.prototype, 'showModal'), 
        closeModalSpy : vi.spyOn(HTMLDialogElement.prototype, 'close')  
    };
}
