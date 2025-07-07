import styled from 'styled-components';
import { useEffect, useState } from 'react';

import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import Checkbox from '../../ui/Checkbox';
import BookingDataBox from '../../features/bookings/BookingDataBox';
import useBooking from '../bookings/useBooking';
import Spinner from '../../ui/Spinner';
import useCheckin from './useCheckin';
import { formatCurrency } from '../../utils/helpers';
import useSettings from '../settings/useSettings';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const moveBack = useMoveBack();

  const { booking, isPending: isLoadingBooking } = useBooking();
  const { isPending: isCheckingIn, checkin } = useCheckin();
  const { isPending: isLoadingSettings, settings } = useSettings();

  useEffect(() => {
    setConfirmPaid(booking?.isPaid ?? false);
  }, [booking]);

  if (isLoadingBooking || isLoadingSettings) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  const optionalBreakfastPrice =
    settings.breakfastPrice * numNights * numGuests;

  function handleCheckin() {
    if (!confirmPaid) return;
    if (addBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    } else {
      checkin({ bookingId, breakfast: {} });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Checkbox
          id="breakfast"
          checked={addBreakfast}
          onChange={() => {
            setAddBreakfast((add) => !add);
            setConfirmPaid(false);
          }}
        >
          Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
        </Checkbox>
      )}

      <Checkbox
        id="confirm-payment"
        checked={confirmPaid}
        onChange={() => setConfirmPaid((confirm) => !confirm)}
        disabled={confirmPaid || isCheckingIn}
      >
        I confirm that {guests.fullName} has paid the total amount of{' '}
        {!addBreakfast
          ? formatCurrency(totalPrice)
          : `${formatCurrency(
              totalPrice + optionalBreakfastPrice
            )} (${formatCurrency(totalPrice)} + ${formatCurrency(
              optionalBreakfastPrice
            )})`}
      </Checkbox>

      <ButtonGroup>
        <Button
          onClick={handleCheckin}
          size="medium"
          variation="primary"
          disabled={!confirmPaid || isCheckingIn}
        >
          Check in booking #{bookingId}
        </Button>
        <Button variation="secondary" size="medium" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
