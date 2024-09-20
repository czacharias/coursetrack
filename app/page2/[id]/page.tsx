'use client';

const Page = ({params: {id}}) => {
    return(
      <p className="text-2xl">
        Hello <strong>{id}</strong>
      </p>
    )
  }
  
  export default Page;