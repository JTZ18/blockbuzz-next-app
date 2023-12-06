import React from 'react'
import { Post } from '../../types/types';
import { Separator } from './separator';
import { SocialNetworkPost } from '../../types/SocialNetworkPost';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"


interface Comment {
  data: SocialNetworkPost | null;
}

const Comment: React.FC<Comment> = ({ data }) => {
  if (data?.referencedPost === "") { return null;}
  return (
    // <div className='w-full'>
    //   <p className='font-bold'>{data?.profileName}</p>
    //   <p>{data?.content}</p>
    //   <Separator className='my-4'/>
    // </div>
    <Accordion type="single" collapsible className='w-full'>
      <AccordionItem value="item-1">
        <AccordionTrigger>{data?.profileName}</AccordionTrigger>
        <AccordionContent>
          {data?.content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default Comment;