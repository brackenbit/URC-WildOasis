/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Wraps CabinFormReusable to create cabins.
    Rewritten to:
    - refactor cabin editing functionality for better separation of concerns.
      (Example project had a single CreateCabinForm also performing editing.)

*/

import CabinFormReusable from "./CabinFormReusable";
import { useCreateCabin } from "./useCreateCabin";

export default function CreateCabinForm({ onCloseModal }) {
    const { isCreating, createCabin } = useCreateCabin();

    function handleSubmit(data) {
        // data.image will be a FileList.
        // Take the first entry.
        const image = data.image[0];

        createCabin({ ...data, image });
    }

    return (
        <CabinFormReusable
            onSubmit={handleSubmit}
            isWorking={isCreating}
            onCloseModal={onCloseModal}
        />
    );
}
