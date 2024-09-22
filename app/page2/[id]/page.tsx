import { sql } from "@vercel/postgres";
import { createInvoice, fetchUsers, getCourse, getAssignment, allUserInfo } from "@/app/lib/actions";




export default async function Page({params: {id}}: {params : {id : string}}){
    const users = await fetchUsers(id);
    const userData = await allUserInfo(id);
    return (
      <div>
        {users.map((user) => (
          <div key={user.id}>
            {user.id} - {user.password}
            <span>courses: 
                {user.courses.map((course : string) => (
                <div key={course}>
                    { course}
                    <div className="font-10px">
                        {userData.userAssignments.map((assignment : any) => (
                            <div key='assignment'>
                                {assignment.name}
                                <p>{assignment.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                ))}
            </span>
                
          </div>
        ))}
      
        <p className="text-2xl">
            Hello <strong>{id}</strong>
        </p>
        <div>
            {userData.userInfo.id}
        </div>
        <div>
            {userData.userCourses.map((course : any) => (
                <div key={course.id}>
                    {course.name}
                </div>
            ))}
        </div>
        <div>
            {userData.userAssignments.map((assignment : any) => (
                <div key={assignment.id}>
                    {assignment.description}
                </div>
            ))}
        </div>
      </div>
    )
}
  
