'use server';

import { z } from 'zod';
import { QueryResultRow, sql } from '@vercel/postgres';
import * as crypto from "crypto";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import bcrypt from "bcryptjs";
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { auth, signOut, signIn } from "@/auth";

const FormSchema = z.object({
    id: z.string(),
    password : z.string()
});

export async function hashPassword(password:string, salt : string, callback : Function) {
    if(salt == ""){
        var salt = crypto.randomBytes(32).toString('base64');
    }
    var hash = crypto.pbkdf2(password, salt, 1000, 64, "sha256", (err, derivedKey) => {
        if(err){
            throw new Error("Hash Failed");
        }

        else{
            callback({
                'salt' : salt,
                'hash' : derivedKey.toString("hex")
            });
        }
    })
}
   
function generateUUID () {
    let time = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        time += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let random = (time + Math.random() * 16) % 16 | 0;
        time = Math.floor(time / 16);
        return (c === 'x' ? random : (random & 0x3 | 0x8)).toString(16);
    });
}


export async function createUser(id:string, password:string) {

    var salt : string, key : string;

    salt = await bcrypt.genSalt(10);
    key = await bcrypt.hash(password, salt);

    try{

        const data = await sql`
        SELECT (id)
        FROM USERS
        `
        const users =data.rows;
    
        for(var d = 0; d < users.length; d++){
            if(users[d].id == id){
                return;
            }
        }


        await sql`
        INSERT INTO USERS (id, salt, password, courses)
        VALUES (${id}, ${salt}, ${key}, '{}')
        `;

        
    }
    catch(err){
        throw new Error("User creation failed");
    }

    revalidatePath('/page2');
    redirect('/page2');
}

export async function createClass(name : string, subject : string){

    const id = generateUUID()

    try{
        await sql`
        INSERT INTO COURSES (id, name, subject, assignments)
        VALUES(${id}, ${name}, ${subject}, '{}')`;
    }
    catch(err){
        throw new Error("Failed to create new class");
    }
}

export async function createAssignment(name:string, description:string, classId:string){
   
    const id = generateUUID();

    try{
        await sql`
        INSERT INTO ASSIGNMENTS
        VALUES(${id}, ${name}, ${description})
        `;

        await sql`
        UPDATE CLASSES
        SET id=id name=name assignments = array_append(assignments, ${id})
        WHERE ${classId}
        `;
    }
    catch(err){
        throw new Error("Failed to create new assignment");
    }


}

export async function fetchUser(id : string){
    try {
      const data = await sql`
        SELECT * 
        FROM USERS
        WHERE id = ${id}
        ORDER BY id ASC
      `;
  
      const customers = data.rows[0];
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

        const course = data.rows[0];
        return course;
    }
    catch(err){
        throw new Error('Cannot find course');
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
        const data = await fetchUser(userId);
        const userInfo = data;
        console.log(" ======== USER INFO ========");
        console.log(userId);
        console.log(userInfo);

        const userCourses: QueryResultRow[] = [];
        for(let course of userInfo.courses){
            console.log("course =>> " + course);
            var courseInfo = await getCourse(course);
            userCourses.push(courseInfo);
        };

        console.log(" ======== USER COURSES ========");
        console.log(userCourses);
        
        const userAssignments: QueryResultRow[] = [];
        for(let course of userCourses){
            for(let assignment of course.assignments){
                var assignmentInfo = await getAssignment(assignment);
                userAssignments.push(assignmentInfo[0]);
            }
        }
            
        console.log(" ======== USER ASSIGNMENTS ========");
        console.log(userAssignments);

        return {'user' : userInfo, 'courses' : userCourses, 'assignments' : userAssignments};
    }
    catch{
        throw new Error("Internal error");
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }