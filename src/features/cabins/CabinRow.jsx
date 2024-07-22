/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - support smart pagination (use forwardRef to get refs of Body and Row)
    - add optional solution for cache-busting to get correct image after cabin edit
*/

import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import { useDeleteCabin } from "./useDeleteCabin";
import EditCabinForm from "./EditCabinForm";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateCabin } from "./useCreateCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { forwardRef } from "react";

const Img = styled.img`
    display: block;
    width: 6.4rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;

const Discount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;

const CabinRow = forwardRef(function CabinRow({ cabin }, ref) {
    const {
        id: cabinId,
        name,
        maxCapacity,
        regularPrice,
        discount,
        image,
        description,
    } = cabin;

    const { isDeleting, deleteCabin } = useDeleteCabin();
    const { isCreating, createCabin } = useCreateCabin();

    function handleDuplicate() {
        createCabin({
            name: `Copy of ${name}`,
            maxCapacity,
            regularPrice,
            discount,
            image,
            description,
        });
    }

    return (
        <Table.Row ref={ref}>
            {/* Supabase caching prevents new image from being returned after
                editing a cabin. Optionally use this for cache busting to
                force the new image. */}
            {/* <Img src={`${image}?bust=${Date.now()}`} /> */}

            <Img src={image} />
            <Cabin>{name}</Cabin>
            <div>Fits up to {maxCapacity}</div>
            <Price>{formatCurrency(regularPrice)}</Price>
            {discount ? (
                <Discount>{formatCurrency(discount)}</Discount>
            ) : (
                <span>&mdash;</span>
            )}
            <div>
                {/* Mixing Modal and Menus together: */}
                <Modal>
                    <Menus.Menu>
                        <Menus.Toggle id={cabinId} />
                        <Menus.List id={cabinId}>
                            <Menus.Button
                                icon={<HiSquare2Stack />}
                                onClick={handleDuplicate}
                            >
                                Duplicate
                            </Menus.Button>

                            <Modal.Open
                                opens="edit"
                                render={(openFunction) => (
                                    <Menus.Button
                                        icon={<HiPencil />}
                                        onClick={openFunction}
                                    >
                                        Edit
                                    </Menus.Button>
                                )}
                            />

                            <Modal.Open
                                opens="delete"
                                render={(openFunction) => (
                                    <Menus.Button
                                        icon={<HiTrash />}
                                        onClick={openFunction}
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </Menus.Button>
                                )}
                            />
                        </Menus.List>

                        <Modal.Window name="edit">
                            <EditCabinForm cabinToEdit={cabin} />
                        </Modal.Window>

                        <Modal.Window name="delete">
                            <ConfirmDelete
                                resourceName="cabin"
                                disabled={isDeleting}
                                onConfirm={() => deleteCabin(cabinId)}
                            />
                        </Modal.Window>
                    </Menus.Menu>
                </Modal>
            </div>
        </Table.Row>
    );
});

export default CabinRow;
