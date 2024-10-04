import { QueryResultRow, sql } from "@vercel/postgres";
import { createUser, fetchUser, getCourse, getAssignment, allUserInfo } from "@/app/lib/actions";




export default async function Page({params: {id}}: {params : {id : string}}){

    const { user, courses, assignments } = await allUserInfo(id);

    return (
      <div>
        <span><h1>Welcome {user.id}!</h1></span>
        <h2>Courses:</h2>
        <div>
            {courses.map((course : any) => (
                <div key={course.name}>
                    <h3>{course.name}</h3>
                    <div>
                        {assignments.map((assignment : any) => (
                            <div key={course.name +'/'+assignment.name}>
                                <h4>{assignment.name}</h4>
                                <p>{assignment.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    )
}
  
