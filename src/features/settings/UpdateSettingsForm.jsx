import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import useSettings from './useSettings';
import useUpdateSetting from './useUpdateSetting';
import Spinner from '../../ui/Spinner';

function UpdateSettingsForm() {
  const { isLoading, settings } = useSettings();
  const { isUpdating, updateSetting } = useUpdateSetting();
  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = settings || {};

  function handleUpdate(e) {
    const { value, id, defaultValue } = e.target;

    if (!value || !id || defaultValue === value) return;

    updateSetting(
      { [id]: value },
      {
        onSuccess: () => {
          // Only update defaultValue if mutation succeeded
          e.target.defaultValue = value;
        },
        onError: () => {
          // Revert the input's value back to its default
          e.target.value = defaultValue;
        },
      }
    );
  }

  if (isLoading) return <Spinner />;

  return (
    <Form type='regular'>
      <FormRow label='Minimum nights/booking'>
        <Input
          type='number'
          id='minBookingLength'
          defaultValue={minBookingLength}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e)}
        />
      </FormRow>
      <FormRow label='Maximum nights/booking'>
        <Input
          type='number'
          id='maxBookingLength'
          defaultValue={maxBookingLength}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e)}
        />
      </FormRow>
      <FormRow label='Maximum guests/booking'>
        <Input
          type='number'
          id='maxGuestsPerBooking'
          defaultValue={maxGuestsPerBooking}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e)}
        />
      </FormRow>
      <FormRow label='Breakfast price'>
        <Input
          type='number'
          id='breakfastPrice'
          defaultValue={breakfastPrice}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e)}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
