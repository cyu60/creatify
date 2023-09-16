import Header from '@/components/Header'
import { codeGeneration, imageGeneration } from '@/lib/constants'
import React from 'react'

const CodeGeneration = () => {
  return (
<div className="">
      <Header
        title={codeGeneration.label}
        icon={codeGeneration.icon}
        description={codeGeneration.description}
        iconColor={codeGeneration.color}
        bgColor={codeGeneration.bgColor}
      ></Header>
      <h1 className='font-bold text-2xl item-center h-full w-full justify-center text-center'> Coming soon...</h1>
      </div>  )
}

export default CodeGeneration