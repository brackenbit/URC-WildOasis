/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    New component to provide edit cabin functionality, wrapping CabinFormReusable.
*/

import { useEditCabin } from "./useEditCabin";
import CabinFormReusable from "./CabinFormReusable";

export default function EditCabinForm({ cabinToEdit, onCloseModal }) {
    const { id: editId, ...editValues } = cabinToEdit;

    const { isEditing, editCabin } = useEditCabin();

    function handleSubmit(data) {
        // For edit, data.image may be either:
        // - a string with existing image path, if image wasn't touched
        // - a FileList, if a new image was uploaded
        // If it's the FileList, take the first entry
        const image =
            typeof data.image === "string" ? data.image : data.image[0];

        editCabin({
            newCabinData: { ...data, image },
            id: editId,
        });
    }

    return (
        <CabinFormReusable
            onSubmit={handleSubmit}
            isWorking={isEditing}
            editValues={editValues}
            onCloseModal={onCloseModal}
        />
    );
}
