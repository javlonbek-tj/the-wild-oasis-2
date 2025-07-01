import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import FileInput from '../../ui/FileInput';

import { createCabin as createCabinApi } from '../../services/apiCabins';
import FormRow from '../../ui/FormRow';

function CreateCabinForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState, getValues } = useForm();

  const { errors } = formState;

  const { isPending, mutate: createCabin } = useMutation({
    mutationFn: createCabinApi,
    onSuccess: () => {
      toast.success('New cabin successfully created');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    createCabin(data);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation='secondary' type='reset' size='medium'>
          Cancel
        </Button>
        <Button variation='primary' size='medium' disabled={isPending}>
          Create cabin
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
