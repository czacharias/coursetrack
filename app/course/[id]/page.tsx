import { getCourse, getAssignment } from "@/app/lib/actions";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export default async function Page({params: {id}}: {params : {id : string}}){

    const course = await getCourse(id);
    console.log(course);
    const assignments : any[] = [];
    for (var assignment of course.assignments){
        let a = await getAssignment(assignment);
        assignments.push(a);
    }
    console.log(assignments);
    

    return (
        <div>
            <div className="flex text-9xl justify-left items-center p-10">
                <header>{course.name}</header>
            </div>
            <div className="flex justify-center  min-h-dvh p-10">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Duedate</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assignments.map((assignment : any) => (
                            <TableRow key={course.name +'/'+assignment.name}>
                                <TableCell className="font-medium">{assignment.id}</TableCell>
                                <TableCell>{assignment.name}</TableCell>
                                <TableCell>{course.subject}</TableCell>
                                <TableCell className="text-right">the future</TableCell>
                            </TableRow>
                    ))}
                    
                </TableBody>
                </Table>
        </div>
        </div>
        
    )

}