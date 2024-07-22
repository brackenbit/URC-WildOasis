/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateCabinForm from "./CreateCabinForm";

export default function AddCabin() {
    return (
        <div>
            <Modal>
                <Modal.Open
                    opens="cabin-form"
                    render={(openFunction) => (
                        <Button onClick={openFunction}>Add new cabin</Button>
                    )}
                />
                <Modal.Window name="cabin-form">
                    <CreateCabinForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}
