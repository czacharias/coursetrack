'use client';
import { sql } from "@vercel/postgres";
import { createInvoice, fetchUsers } from "@/app/lib/actions";




export default async function Page({params: {id}}: {params : {id : string}}){
    const users = await fetchUsers(id);
    return (
      <div>
        {users.map((user) => (
          <div key={user.id}>
            {user.id} - {user.password}
          </div>
        ))}
      
      <p className="text-2xl">
        Hello <strong>{id}</strong>
      </p>
      </div>
    )
}
  
