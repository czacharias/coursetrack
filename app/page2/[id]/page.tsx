import { sql } from "@vercel/postgres";
import { createUser, fetchUser, getCourse, getAssignment, allUserInfo } from "@/app/lib/actions";




export default async function Page({params: {id}}: {params : {id : string}}){
    const users = await fetchUser(id);
    const course = await getCourse(users[0].courses[0]);
    const assignments = await getAssignment(course[0].assignments[0]);
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
                    
                </div>
                ))}
                <div className="font-10px">
                    {userData.userAssignments.map((assignment : any) => (
                        <div key='assignment'>
                            {assignment.name}
                            <p>{assignment.description}</p>
                        </div>
                    ))}
                </div>
            </span>
                
          </div>
        ))}

        <p className="text-2xl">
            Hello <strong>{id}</strong>
        </p>
        <p>
            {course[0].name}
        </p>
        <p>
            {course[0].assignments}
        </p>
        <div>
            {userData.userInfo.id}
        </div>
        <div>
            {course[0].assignments[0]}
        </div>
        <div> 
            {userData.userCourses.map((course : any) => (
                <div key={course.id}>
                    {course.assignments}
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
  
