/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - support smart pagination (use forwardRef to get refs of Body and Row)
*/

import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import Menus from "../../ui/Menus";
import {
    HiArrowDownOnSquare,
    HiArrowUpOnSquare,
    HiEye,
    HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useCheckOut } from "../check-in-out/useCheckOut";
import Modal from "../../ui/Modal";
import { useDeleteBooking } from "./useDeleteBooking";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { forwardRef } from "react";

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Stacked = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    & span:first-child {
        font-weight: 500;
    }

    & span:last-child {
        color: var(--color-grey-500);
        font-size: 1.2rem;
    }
`;

const Amount = styled.div`
    font-family: "Sono";
    font-weight: 500;
`;

const BookingRow = forwardRef(function BookingRow2(
    {
        booking: {
            id: bookingId,
            created_at,
            startDate,
            endDate,
            numNights,
            numGuests,
            totalPrice,
            status,
            guests: { fullName: guestName, email },
            cabins: { name: cabinName },
        },
    },
    ref
) {
    const navigate = useNavigate();
    const { checkOut, isCheckingOut } = useCheckOut();
    const { deleteBooking, isDeleting } = useDeleteBooking();

    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };

    return (
        <Table.Row ref={ref}>
            <Cabin>{cabinName}</Cabin>

            <Stacked>
                <span>{guestName}</span>
                <span>{email}</span>
            </Stacked>

            <Stacked>
                <span>
                    {isToday(new Date(startDate))
                        ? "Today"
                        : formatDistanceFromNow(startDate)}{" "}
                    &rarr; {numNights} night stay
                </span>
                <span>
                    {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
                    {format(new Date(endDate), "MMM dd yyyy")}
                </span>
            </Stacked>

            <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

            <Amount>{formatCurrency(totalPrice)}</Amount>

            <Modal>
                <Menus.Menu>
                    <Menus.Toggle id={bookingId} />
                    <Menus.List id={bookingId}>
                        <Menus.Button
                            icon={<HiEye />}
                            onClick={() => navigate(`/bookings/${bookingId}`)}
                        >
                            See details
                        </Menus.Button>

                        {status === "unconfirmed" && (
                            <Menus.Button
                                icon={<HiArrowDownOnSquare />}
                                onClick={() =>
                                    navigate(`/checkin/${bookingId}`)
                                }
                            >
                                Check in
                            </Menus.Button>
                        )}

                        {status === "checked-in" && (
                            <Menus.Button
                                icon={<HiArrowUpOnSquare />}
                                onClick={() => checkOut(bookingId)}
                                disabled={isCheckingOut}
                            >
                                Check out
                            </Menus.Button>
                        )}

                        {/* Delete button wrapped in Modal.Open to support delete confirmation */}
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

                    <Modal.Window name="delete">
                        <ConfirmDelete
                            resourceName="cabin"
                            disabled={isDeleting}
                            onConfirm={() => deleteBooking(bookingId)}
                        />
                    </Modal.Window>
                </Menus.Menu>
            </Modal>
        </Table.Row>
    );
});

export default BookingRow;
