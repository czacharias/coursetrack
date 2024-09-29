'use server';

import { z } from 'zod';
import { QueryResultRow, sql } from '@vercel/postgres';
import * as crypto from "crypto";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    password : z.string()
});

async function hashPassword(password:string, salt : string, callback : Function) {
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

    var salt, key;
    hashPassword(password, "", async (objs : any)=>{
        salt= await objs.salt;
        key= await objs.derivedKey;
    });

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
        INSERT INTO USERS (id, salt, password)
        VALUES (${id}, ${salt}, ${key})
        `;

        //revalidatePath('/app');
        //redirect('/app');
    }
    catch(err){
        throw new Error("User creation failed");
    }
    
}

export async function authUser(userId : string, password : string){
    try{

        const data = await sql`
        SELECT *
        FROM USERS
        WHERE id=${userId}
        `;

        var user = data.rows[0];
        var salt = user.salt;
        
        return hashPassword(password, salt, (objs : any)=>{return objs.derivedKey;}) == user.password;

    }
    catch(err){
        throw new Error("Auth Failed")
    }
}

export async function createClass(name : string){

    const id = generateUUID()

    try{
        await sql`
        INSERT INTO CLASSES
        VALUES(${id}, ${name})`;
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

export async function fetchUser(id : string) {
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
        const data = await fetchUser(userId);
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
  
