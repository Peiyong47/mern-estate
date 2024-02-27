import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem({listing}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] '>
        <Link to={`/listing/${listing._id}`}>
            <img 
                src={listing.imageUrls[0] || 
                    'https://www.bing.com/images/search?view=detailV2&ccid=ZFars6Cl&id=BEFC8A9EAA219627A383901C8379292781798BA1&thid=OIP.ZFars6ClrcPbi1HszEZeNwHaEE&mediaurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.6456abb3a0a5adc3db8b51eccc465e37%3frik%3doYt5gScpeYMckA%26riu%3dhttp%253a%252f%252fimages.dailyhive.com%252f20160919115313%252fReal-estate-in-Vancouver-Shutterstock.jpg%26ehk%3db1j%252btOwjQI62cmjh2v0rfXh1pFaSHc5BnpwPhXrvnL0%253d%26risl%3d%26pid%3dImgRaw%26r%3d0&exph=1100&expw=2000&q=real+estate+image&simid=608024815537912945&FORM=IRPRST&ck=9A358ED7347071D00A11B0650AD0D77E&selectedIndex=13&itb=0'} 
                alt='listing cover' 
                className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
            />
            <div className='p-3 flex flex-col gap-2 w-full'>
                <p className='truncate text-lg font-semibold text-slate-700'>{listing.name}</p>
                <div className='flex items-center gap-1'>
                    <MdLocationOn className='h-4 w-4 text-green-700' />
                    <p className='text-sm text-gray-500 truncate w-full'>{listing.address}</p>
                </div>
                <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
                <p className='text-slate-500 mt-2 font-semibold'>
                    $ 
                    {listing.offer 
                        ? listing.discountPrice.toLocaleString('en-US')
                        : listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' && ' /month'}
                </p>
                <div className='text-slate-700 flex gap-4'>
                    <div className='font-bold text-xs'>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                    </div>
                    <div className='font-bold text-xs'>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                    </div>
                </div>
            </div>
        </Link>
       
    </div>
  )
}
