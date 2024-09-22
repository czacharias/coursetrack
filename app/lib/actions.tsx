'use server';

import { z } from 'zod';
import { QueryResultRow, sql } from '@vercel/postgres';

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
          password, 
          courses
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

export async function getCourse(courseId : string){
    try{
        const data = await sql`
        SELECT *
        FROM COURSES
        WHERE id = ${courseId}
        `;

        const course = data.rows;
        return course;
    }
    catch(err){
        throw new Error('dumbass');
    }
}

export async function getAssignment(assignmentId:string){
    try{
        const data = await sql`
        SELECT *
        FROM ASSIGNMENTS
        WHERE id = ${assignmentId}`;

        const assginment = data.rows;
        return assginment;
    }
    catch(err){
        throw new Error("could not find assignment")
    }
}

export async function authCourse(userId:string, courseId:string){
    try {
        const data = await sql`
        SELECT courses
        FROM USERS
        WHERE id = ${userId}`;

        const courses = data.rows;
        if(courseId in Object.keys(courses)){
            return true;
        }
        return false;
    }
    catch(err){
        throw new Error("permission for course not granted")
    }
}

export async function allUserInfo(userId:string){
    try{
        const data = await fetchUsers(userId);
        const userInfo = data[0];
        
        const userCourses: QueryResultRow[] = [];
        for(let course of userInfo.courses){
            var courseInfo = await getCourse(course);
            userCourses.push(courseInfo[0]);
        };
        
        const userAssignments: QueryResultRow[] = [];
        for(let course of userCourses){
            for(let assignment of course.assignments){
                var assignmentInfo = await getAssignment(assignment);
                userAssignments.push(assignmentInfo[0]);
            }
        }
            

        return {'userInfo' : userInfo, 'userCourses' : userCourses, 'userAssignments' : userAssignments};
    }
    catch{
        throw new Error("Internal error");
    }
}
  
