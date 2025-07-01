import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    throw new Error('Cabins not found');
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase
    .from('cabins')
    .delete()
    .eq('id', id)
    .select('image')
    .single();

  if (error) {
    throw new Error('Cabin could not be deleted');
  }

  // Delete the image from the bucket
  if (data?.image) {
    const oldImageName = data.image.split('/').pop();

    const { error: deleteError } = await supabase.storage
      .from('cabin-images')
      .remove([oldImageName]);

    if (deleteError) {
      console.warn('Could not delete old image:', deleteError);
      // Don't throw error here as the main operation succeeded
    }
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  let oldImagePath = null;

  // If editing and uploading a new image, get the old image path
  if (id && !hasImagePath) {
    const { data: currentCabin, error: fetchError } = await supabase
      .from('cabins')
      .select('image')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error('Could not fetch current cabin data');
    }

    oldImagePath = currentCabin.image;
  }

  // 1. Create/edit cabin

  let query = supabase.from('cabins');

  // A) CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) UPDATE
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq('id', id);

  const { data, error } = await query.select().single();

  if (error) {
    throw new Error('Cabin could not be created');
  }

  if (hasImagePath) return data;

  // 2. Upload a file
  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  // Delete the cabin if there is storage error
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    throw new Error(
      'Cabin image could not be uploaded and the cabin was not created'
    );
  }

  // 3. Delete old image (only when editing with new image upload)
  if (oldImagePath && oldImagePath.includes(supabaseUrl)) {
    const oldImageName = oldImagePath.split('/').pop();

    const { error: deleteError } = await supabase.storage
      .from('cabin-images')
      .remove([oldImageName]);

    if (deleteError) {
      console.warn('Could not delete old image:', deleteError);
      // Don't throw error here as the main operation succeeded
    }
  }

  return data;
}
