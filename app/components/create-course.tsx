
"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createClass } from "../lib/actions";
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { redirect } from "next/dist/server/api-utils"
import { useActionState } from "react"

const formSchema = z.object({
    className: z.string().min(2, {
      message: "name must be at least 2 characters.",
    }),
    subject: z.string(),
  })

export default function CreateCourse() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            className: "",
            subject: "",
        }
    })

    function onSubmit(values : z.infer<typeof formSchema>){
        console.log(values);
        createClass(values.className, values.subject);
    }

    return (
        <div className="flex justify-center items-center min-h-dvh">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                    control={form.control}
                    name="className"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Class Name</FormLabel>
                        <FormDescription>
                            This is the name of your class.
                        </FormDescription>
                        <FormControl>
                            <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a verified email to display" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                This is the subject of your class.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                    )}
                    />
                    <Button className="my-6" type="submit">Create</Button>
                </form>
            </Form>
        </div>

    )
}

