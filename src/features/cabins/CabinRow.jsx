import styled from 'styled-components';

import { HiDuplicate, HiPencil, HiTrash } from 'react-icons/hi';

import { useDeleteCabin } from './useDeleteCabin';
import CreateCabinForm from './createCabinForm';
import useCreateCabin from './useCreateCabin';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Menus from '../../ui/Menus';
import { formatCurrency } from '../../utils/helpers';
import Table from '../../ui/Table';

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
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { isCreating, createCabin } = useCreateCabin();

  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description,
  } = cabin;

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
    <Table.Row>
      <Img src={image}></Img>
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{regularPrice}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={cabinId} />

          <Menus.List id={cabinId}>
            <Modal.Open opens='delete-form'>
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>

            <Modal.Open opens='edit-form'>
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            </Modal.Open>

            <Menus.Button
              disabled={isCreating}
              onClick={handleDuplicate}
              icon={<HiDuplicate />}
            >
              Copy
            </Menus.Button>
          </Menus.List>

          <Modal.Window name='delete-form'>
            <ConfirmDelete
              disabled={isDeleting}
              onConfirm={() => deleteCabin(cabinId)}
              resourceName='cabin'
            />
          </Modal.Window>

          <Modal.Window name='edit-form'>
            <CreateCabinForm cabinToEdit={cabin} />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default CabinRow;
