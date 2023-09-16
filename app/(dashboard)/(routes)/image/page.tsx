import Header from '@/components/Header'
import { imageGeneration } from '@/lib/constants'
import React from 'react'

const ImageGeneration = () => {
  return (
<div className="">
      <Header
        title={imageGeneration.label}
        icon={imageGeneration.icon}
        description={imageGeneration.description}
        iconColor={imageGeneration.color}
        bgColor={imageGeneration.bgColor}
      ></Header>
      <h1 className='font-bold text-2xl item-center h-full w-full justify-center text-center'> Coming soon...</h1>
      </div>  )
}

export default ImageGeneration