
"use client"


import Card from "@/components/common/Card";
import { use} from "react";
import { useRouter } from "next/navigation";
const React = require("react");



export default function HomePage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  
const history = useRouter();
const validation = () => {
  if (!email || !password) {
    alert("Please fill in both email and password fields.");
    return false;
  }
  return true;
};
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
 const isValid = validation();
 if(!isValid) {
  return;
 }
   history.push("/products");
  }

  return (
    <>
     
      <div className="grid">
      <h1 className="text-3xl font-bold underline">Login page</h1>
      <form>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            onChange={(e:any) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
             onChange={(e:any) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
       onClick={ (e:any)=>handleSubmit(e)}
        
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
               focus:ring-blue-300 fonta
-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
      </div>
    </>
  );
}
