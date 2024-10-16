
import { Button } from "@/components/ui/button";
import { createUser} from "../lib/actions";
import { getSession, signOut } from "next-auth/react";
import { auth } from "@/auth";

export default async function Page(){
    const data = await auth();
    console.log("start")
    console.log(data);
    console.log('end')
    return (
        <div>
            <a>{ data?.user.id }</a>
            <br></br>
            <a>Courses: </a>
            {
                (data?.user.courses) && <div>{ data?.user.courses.map((course : any) => (
                <a>{course}</a>
            )) }</div>
            }
            
        </div>
    )
}
