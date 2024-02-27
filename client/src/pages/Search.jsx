import { isObjectIdOrHexString } from 'mongoose'
import React from 'react'

export default function Search() {
  return (
    // the right side(search section) and left side (search result) when in small side, they are on top of each other (flex-col)
    // after the medium side, they are side by side (flex-row)
    <div className='flex flex-col md:flex-row'>
        {/* Left side on the Search page UI, the search section */}
        {/* at the small side (mobile side), the border is at the bottom
        after the medium side (tablet side), the border is at the right side */}
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form className='flex flex-col gap-8'>
                <div className='flex items-center gap-2 '> 
                    <label className='whitespace-nowrap font-semibold'>Search Term: </label>
                    <input 
                        type="text"
                        id="searchTerm"
                        placeholder='Search...'
                        className='border rounded-lg p-3 w-full'
                    />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox"
                            id="all"
                            className='w-5'
                        />
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox"
                            id="rent"
                            className='w-5'
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox"
                            id="sale"
                            className='w-5'
                        />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox"
                            id="offer"
                            className='w-5'
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox"
                            id="parking"
                            className='w-5'
                        />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox"
                            id="furnished"
                            className='w-5'
                        />
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select 
                        id="sort_order"
                        className='border rounded-lg p-3'
                    >
                       <option>Price high to low</option>
                       <option>Price low to high</option>
                       <option>Latest</option>
                       <option>Oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
            </form>
        </div>

        {/* Right side on the Search page UI, the search results (listing) */}
        <div className=' '>
            <h1 className='text-3xl font-bold border-b p-3 mt-5 text-slate-600 '>Listing Results</h1>
        </div>
    </div>
  )
}
