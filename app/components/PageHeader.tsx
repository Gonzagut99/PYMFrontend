import React from 'react'
import { BorderBeam } from './ui/border-beam'
import { cn } from '~/lib/utils'

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string,
    imgSrc: string,
}

export const PageHeader = ({title, imgSrc, className, ...rest}:PageHeaderProps) => {
  return (
    <section className={cn('w-full h-[200px] relative p-4 flex items-end rounded-md', className)} {...rest}>
            <img className='w-full h-full absolute object-cover rounded-md inset-0 z-0 mask-linear mask-dir-to-b mask-from-100 mask-to-30 mask-point-to-[95%]' src={imgSrc} alt={title} />
            <h1 className='text-5xl font-black relative z-10 text-primary'>{title}</h1>
            <BorderBeam></BorderBeam>
        </section >
  )
}
