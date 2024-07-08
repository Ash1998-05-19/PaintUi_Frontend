"use client"

import { useForm } from "react-hook-form"


export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()


  const onSubmit = (data) => console.log(data)


  console.log(watch("example")) // watch input value by passing the name of it


  return (
    <section>
      <h1>Dashboard Page</h1>
    </section>
    
  )
}