import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';  
import { Form } from 'react-router-dom';

export default function CreateListing() {
    // flex-col is make the items to be in a column
    // flex-1 is to make the items to take the whole width of the container
    
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

    console.log(formData);
    
    const handleImageSubmit = (e) => { 
        if (files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            setImageUploadError(false);
            
            // Listing can upload more than 1 image, so will have more than one async behaviour
            // so we need to wait for all of them, one by one to finish to be uploaded to storage
            // so we have to use Promise.all() to wait for all of them to finish
            // so at the beginning we will create an empty array to store all the promises
            const promises = [];

           
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
            }).catch((error) => {
                setImageUploadError('Image upload failed (2 MB max per image)!');
                setUploading(false);
            });
        } else {
            setImageUploadError('You can only upload 6 images per listing.');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            // again same, make the filename to be unique, so add the date now to it
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            // filter out the image url that does not match the index (the one that user clicked on to remove it)
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    }

    return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input 
                    type="text" 
                    placeholder='Name'
                    className='border p-3 rounded-lg'
                    id='name'
                    maxLength='62'
                    minLength='10'
                    required
                />
                <textarea 
                    type="text" 
                    placeholder='Description'
                    className='border p-3 rounded-lg'
                    id='description'
                    required
                />
                <input 
                    type="text" 
                    placeholder='Address'
                    className='border p-3 rounded-lg'
                    id='address'
                    required
                />
                <div className='flex gap-6 flex-wrap'>
                     <div className='flex gap-2'>
                        <input type="checkbox" id='sale' className='w-5' />
                        <span>Sell</span>
                     </div>
                     <div className='flex gap-2'>
                        <input type="checkbox" id='rent' className='w-5' />
                        <span>Rent</span>
                     </div>
                     <div className='flex gap-2'>
                        <input type="checkbox" id='parking' className='w-5' />
                        <span>Parking Spot</span>
                     </div>
                     <div className='flex gap-2'>
                        <input type="checkbox" id='furnished' className='w-5' />
                        <span>Furnished</span>
                     </div>
                     <div className='flex gap-2'>
                        <input type="checkbox" id='offer' className='w-5' />
                        <span>Offer</span>
                     </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='bedrooms' min='1' max='10' required 
                            className='p-3 border border-gray-300 rounded-lg' />
                        <p className=''>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='bathrooms' min='1' max='10' required 
                            className='p-3 border border-gray-300 rounded-lg' />
                        <p className=''>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='regularPrice' min='1' max='10' required 
                            className='p-3 border border-gray-300 rounded-lg' />
                            <div className='flex flex-col items-center'>
                                <p className=''>Regular Price</p>
                                <span className='text-xs'>($ /month)</span>
                            </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='discountPrice' min='1' max='10' required 
                            className='p-3 border border-gray-300 rounded-lg' />
                         <div className='flex flex-col items-center'>
                                <p className=''>Discounted Price</p>
                                <span className='text-xs'>($ /month)</span>
                            </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images: 
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input
                        onChange = {(e) => setFiles(e.target.files)}
                        type="file" 
                        id='images' 
                        accept='image/*' 
                        multiple
                        className='p-3 border border-gray-300 rounded w-full'    
                    />
                    <button
                        type='button'
                        disabled={uploading}
                        onClick={handleImageSubmit}
                        className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                    { uploading ? 'Uploading...' : 'Upload' }
                    </button>
                </div>
                <p className='text-red-600 text-sm'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                    <div
                        key={url}
                        className='flex justify-between p-3 border items-center'
                    >
                        <img
                            src={url}
                            alt='listing image'
                            className='w-20 h-20 object-contain rounded-lg'
                        />
                        <button
                            type='button'
                            onClick={() => handleRemoveImage(index)}
                            className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>
                        Delete
                        </button>
                    </div>
                    ))
                }
            <button className='p-3 bg-slate-700 rounded-lg uppercase hover:opacity-95 disabled: opacity-80 text-white'>Create Listing</button>
            </div>
        </form>
    </main>
    )
}