import { current } from '@reduxjs/toolkit';
import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  getDownloadURL, 
  getStorage, 
  ref, 
  uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { 
  updateUserStart, 
  updateUserFailure, 
  updateUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {
  const fileRef = useRef();
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [profilePercent, setProfilePercent] = useState(0);
  const [profileUploadError, setProfileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState(false);
  const dispatch = useDispatch();

  console.log(formData);
  
  useEffect(() => { 
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    // Create a storage reference from our storage service that get unique file name from the current time "Date().getTime()""
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProfilePercent(Math.round(progress));
      },
      (error) => {
        setProfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL) => 
          setFormData({
            ...formData,
            avatar: downloadURL
          })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateProfileSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} 
          type="file" 
          ref={fileRef} 
          hidden 
          accept='image/*' />
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} alt="profile" 
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' 
        />
        <p className='text-sm self-center'>{ 
          profileUploadError ?
            (<span className='text-red-700'>Error Image Upload! (Image must be less than 2MB)</span>)
            : profilePercent > 0 && profilePercent < 100 ? 
              (<span className='text-slate-700'>Uploading {profilePercent}%</span>)
            : profilePercent === 100 ? 
              (<span className='text-green-700'>Image Successfully Uploaded!</span>) : ''
          }
        </p>

        <input 
          type="text" 
          placeholder='username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg' id='username'
          onChange={handleChange} 
        />
        <input 
          type="text" 
          placeholder='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg' id='email'
          onChange={handleChange} 
        />
        <input 
          type="password" 
          placeholder='password'
          className='border p-3 rounded-lg' id='password'
          onChange={handleChange} 
        />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 
        uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>
        
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5 text-center'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5 text-center'>{updateProfileSuccess ? 'User is updated successfully!' : ''}</p>

    </div>
  )
  

}