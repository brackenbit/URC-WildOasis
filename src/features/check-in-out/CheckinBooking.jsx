/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to:
    - improve UI and business logic for payment confirmation
      (Past payments and new payment confirmations now split.)
    - support smarter nav after checkin
      (get origin from react router state,
      pass origin to useCheckIn)
    - use transient props (to avoid invalid parameters leaking onto the DOM).
*/

import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";
import Checkbox from "../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import { useCheckIn } from "./useCheckIn";
import { useSettings } from "../settings/useSettings";
import { useLocation } from "react-router-dom";

const Box = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    padding: 2rem 2.4rem;
`;

function CheckinBooking() {
    const [isTotalPaid, setIsTotalPaid] = useState(false);
    const [hasExistingPayment, setHasExistingPayment] = useState(false);
    const [addBreakfast, setAddBreakfast] = useState(false);

    const location = useLocation();
    const origin = location.state?.origin ?? null;

    const { booking, isLoading: isLoadingBooking } = useBooking();

    useEffect(() => {
        setIsTotalPaid(booking?.isPaid ?? false);
        setHasExistingPayment(booking?.isPaid ?? false);
    }, [booking]);

    const moveBack = useMoveBack();

    const { checkIn, isCheckingIn } = useCheckIn(origin);

    const { settings, isLoading: isLoadingSettings } = useSettings();

    if (isLoadingBooking || isLoadingSettings) return <Spinner />;

    const {
        id: bookingId,
        guests,
        cabinPrice,
        extrasPrice,
        totalPrice,
        numGuests,
        hasBreakfast,
        numNights,
    } = booking;

    const totalBreakfastPrice = settings.breakfastPrice * numNights * numGuests;

    function handleCheckin() {
        if (!isTotalPaid) return;

        if (addBreakfast) {
            checkIn({
                bookingId,
                breakfast: {
                    hasBreakfast: true,
                    extrasPrice: totalBreakfastPrice,
                    totalPrice: totalPrice + totalBreakfastPrice,
                },
            });
        } else {
            checkIn({ bookingId, breakfast: {} });
        }
    }

    function handleChangeBreakfast() {
        // NB: While this may look redundant, state can't simply be toggled onChange,
        // as isTotalPaid is also changed elsewhere.
        if (addBreakfast) {
            // (Removing breakfast after change of mind)
            setAddBreakfast(false);
            setIsTotalPaid(true);
        } else {
            setAddBreakfast(true);
            setIsTotalPaid(false);
        }
    }

    // Define payment confirmation string here to avoid ugly nested ternaries
    let paymentConfirmationString = `I confirm that ${guests.fullName} has paid `;

    if (addBreakfast) {
        if (hasExistingPayment) {
            // Paying only for additional breakfast
            paymentConfirmationString += `the additional amount of ${formatCurrency(
                totalBreakfastPrice
            )}.`;
        } else {
            // Paying for cabin + breakfast
            paymentConfirmationString += `the total amount of ${formatCurrency(
                totalPrice + totalBreakfastPrice
            )} (${formatCurrency(cabinPrice)} + ${formatCurrency(
                totalBreakfastPrice
            )})`;
        }
    } else {
        // Paying only for cabin
        paymentConfirmationString += `the total amount of ${formatCurrency(
            totalPrice
        )}`;
    }

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Check in booking #{bookingId}</Heading>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            {/* Offer breakfast if not yet included */}
            {!hasBreakfast && (
                <Box>
                    <Checkbox
                        checked={addBreakfast}
                        onChange={handleChangeBreakfast}
                        id="breakfast"
                    >
                        Want to add breakfast for{" "}
                        {formatCurrency(totalBreakfastPrice)}?
                    </Checkbox>
                </Box>
            )}

            {/* Display existing confirmed payment */}
            {hasExistingPayment && (
                <Box>
                    Payment of {formatCurrency(totalPrice)}{" "}
                    {hasBreakfast &&
                        `(${formatCurrency(cabinPrice)} + ${formatCurrency(
                            extrasPrice
                        )})`}{" "}
                    has already been confirmed.
                </Box>
            )}

            {/* Display payment confirmation for any outstanding amounts */}
            {(!hasExistingPayment || addBreakfast) && (
                <Box>
                    <Checkbox
                        checked={isTotalPaid}
                        onChange={() => setIsTotalPaid((confirm) => !confirm)}
                        disabled={isCheckingIn}
                        id="confirm"
                    >
                        {paymentConfirmationString}
                    </Checkbox>
                </Box>
            )}

            <ButtonGroup>
                <Button
                    onClick={handleCheckin}
                    disabled={!isTotalPaid || isCheckingIn}
                >
                    Check in booking #{bookingId}
                </Button>
                <Button $variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
}

export default CheckinBooking;
