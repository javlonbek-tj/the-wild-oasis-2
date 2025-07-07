import styled from 'styled-components';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';
import Spinner from '../../ui/Spinner';

import { useMoveBack } from '../../hooks/useMoveBack';
import useBooking from './useBooking';
import { useNavigate } from 'react-router-dom';
import useCheckout from '../check-in-out/useCheckout';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import useDeleteBooking from './useDeleteBooking';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { isPending: isLoadingBooking, booking } = useBooking();
  const { isPending: isCheckingOut, checkout } = useCheckout();
  const { isPending: isDeleting, deleteBooking } = useDeleteBooking();
  const navigate = useNavigate();

  const { status, id } = booking;

  const moveBack = useMoveBack();

  if (isLoadingBooking) return <Spinner />;

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #X</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === 'checked-in' && (
          <Button
            variation="primary"
            size="medium"
            onClick={() => checkout(booking.id)}
            disabled={isCheckingOut}
          >
            Check out
          </Button>
        )}
        {status === 'unconfirmed' && (
          <Button
            variation="primary"
            size="medium"
            onClick={() => navigate(`/checkin/${booking.id}`)}
          >
            Check in
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">Delete booking</Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              disabled={isDeleting}
              onConfirm={() =>
                deleteBooking(id, {
                  onSettled: () => navigate(-1),
                })
              }
            />
          </Modal.Window>
        </Modal>
        <Button variation="secondary" size="medium" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
