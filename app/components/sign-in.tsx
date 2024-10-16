"use client";
import { auth, signOut, signIn } from "@/auth"
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
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { authenticate } from "../lib/actions";
 
const formSchema = z.object({
    id: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string()
      .min(1, { message: 'Must have at least 1 character' })
      .regex(new RegExp(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        ), {
        message: 'Your password is not valid',
      }),
  })



export default function SignIn() {
    
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    );

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      password: "",
    }
    })

    

  return (
    <div>
        <div className="flex justify-center items-center min-h-dvh">
        <Form {...form}>
            <form action={ formAction } className="space-y-3">
                <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormDescription>
                        This is your public display name.
                    </FormDescription>
                    <FormControl>
                        <Input type="id" placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormDescription>
                        Min 8 characters, one uppercase, one lowercase, one number and one special character
                    </FormDescription>
                    <FormControl>
                        <Input type="password" placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button className="my-6" type="submit">Submit</Button>
            </form>
        </Form>
    </div>
    </div>
    
  )
} 
/*
<form
            action={async (formData) => {
                "use server"
                await signIn("credentials", formData)
            }}
        >
            <label>
                Email
                <input name="id" type="id" />
            </label>
            <label>
                Password
                <input name="password" type="password" />
            </label>
            <button>Sign In</button>
        </form>
*/