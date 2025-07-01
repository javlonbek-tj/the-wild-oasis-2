import { useForm } from 'react-hook-form';
import useCreateCabin from './useCreateCabin';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import FileInput from '../../ui/FileInput';

import FormRow from '../../ui/FormRow';
import useUpdateCabin from './useUpdateCabin';

function CreateCabinForm({ cabinToEdit = {} }) {
  const { isCreating, createCabin } = useCreateCabin();
  const { isUpdating, updateCabin } = useUpdateCabin();

  const { id: cabinId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(cabinId);

  const { register, handleSubmit, reset, formState, getValues } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;

  function onSubmit(data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0];
    if (!isEditSession) {
      createCabin(
        { ...data, image },
        {
          onSuccess: () => {
            reset();
          },
        }
      );
    } else {
      updateCabin(
        { newCabin: { ...data, image }, id: cabinId },
        {
          onSuccess: (data) => {
            reset(data);
          },
        }
      );
    }
  }

  const isPending = isCreating || isUpdating;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type='regular'>
      <FormRow label='Cabin name' error={errors?.name?.message}>
        <Input
          type='text'
          id='name'
          disabled={isPending}
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
        <Input
          type='number'
          id='maxCapacity'
          disabled={isPending}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>
      <FormRow label='Regular price' error={errors?.regularPrice?.message}>
        <Input
          type='number'
          id='regularPrice'
          disabled={isPending}
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Regular price should be at least 1',
            },
          })}
        />
      </FormRow>
      <FormRow label='Discount' error={errors?.discount?.message}>
        <Input
          type='number'
          id='discount'
          defaultValue={0}
          disabled={isPending}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) =>
              value <= +getValues().regularPrice ||
              'Discount should be less than regular price',
          })}
        />
      </FormRow>
      <FormRow
        label='Description for website'
        error={errors?.description?.message}
      >
        <Textarea
          type='number'
          id='description'
          defaultValue=''
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Cabin photo' error={errors?.image?.message}>
        <FileInput
          id='image'
          accept='image/*'
          disabled={isPending}
          {...register('image', {
            required: isEditSession ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation='secondary' type='reset' size='medium'>
          Cancel
        </Button>
        <Button variation='primary' size='medium' disabled={isPending}>
          {isEditSession ? 'Edit' : 'Create'} cabin
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
