import Button from '../../ui/Button';

import CreateCabinForm from './createCabinForm';
import Modal from '../../ui/Modal';

function AddCabin() {
  return (
    <Modal>
      <Modal.Open opens='cabin-form'>
        <Button>Add new Button</Button>
      </Modal.Open>
      <Modal.Window name='cabin-form'>
        <CreateCabinForm />
      </Modal.Window>
    </Modal>
  );
}

/* function AddCabin() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <Button
        size='medium'
        variation='primary'
        onClick={() => setShowForm(!showForm)}
      >
        Add New Cabin
      </Button>
      );
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <CreateCabinForm onCloseModal={() => setShowForm(false)} />
        </Modal>
      )}
    </>
  );
} */

export default AddCabin;
