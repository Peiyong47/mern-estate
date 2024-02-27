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
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  // style: 
  // truncate: truncate the text(make the rest of text into '...') if it's too long
  const fileRef = useRef();
  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [profilePercent, setProfilePercent] = useState(0);
  const [profileUploadError, setProfileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

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

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch (`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => { 
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false)
      {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false)
      {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      // show the updated listing by removing the deleted listing
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
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
        <Link 
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' 
          to='/create-listing'>
            Create Listing
        </Link>
        
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5 text-center'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5 text-center'>{updateProfileSuccess ? 'User is updated successfully!' : ''}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{ showListingsError ? 'Error showing listings' : '' }</p>
      {userListings && userListings.length > 0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div 
              key={listing._id} 
              className='border rounded-lg p-3 flex justify-between items-center gap-4'>
              <Link to={`/listing/${listing._id}`}>
                <img 
                  src={listing.imageUrls[0]} 
                  alt='listing cover'
                  className='h-16 w 1-6 object-contain'
                />
              </Link>
              <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
                <p className='truncate'>{listing.name}</p>
              </Link>
              <div className='flex flex-col gap-1 items-center'>
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}