'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';

const FormSchema = z.object({
    id: z.string(),
    password : z.string()
  });
   

export async function createInvoice(formData: FormData) {
    const { id, password } = FormSchema.parse({
      id : formData.get("id"),
      password : formData.get("password")
    });

    await sql`
    INSERT INTO USERS (id, password)
    VALUES (${id}, ${password})
  `;
}

export async function fetchUsers(id : string) {
    try {
      const data = await sql`
        SELECT
          id,
          password
        FROM USERS
        WHERE id = ${id}
        ORDER BY id ASC
      `;
  
      const customers = data.rows;
      return customers;
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to fetch all customers.');
    }
  }
  
