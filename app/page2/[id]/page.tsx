'use client';


export default function Page({params: {id}}: {params : {id : string}}){
    return(
      <p className="text-2xl">
        Hello <strong>{id}</strong>
      </p>
    )
}
  
