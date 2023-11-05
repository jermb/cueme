'use client';
import { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";

const sleep = (ms:any) => new Promise((r) => setTimeout(r, ms));

interface Message {
  text: string,
  isUser: boolean,
  type: string | undefined,
  feedback: string | undefined
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessages = (items:Message[]) => {
    var temp = [...messages];
    // temp.push({ text: text, isUser: isUser });
    temp = temp.concat(items);
    setMessages(temp);
    // Hello! It's great that you're looking to improve your social skills. I'm happy to chat with you and offer some feedback. Is there a particular topic you'd like to discuss?
  }

  const generatePrompt = (messages: Message[]) => {
    return messages
      .map((message) =>
        message.isUser
          ? `[INST] ${message.text} [/INST]`
          : `${message.text}`
      )
      .join("\n");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const input = e.target.prompt.value;
    e.target.reset();
    addMessages([{text: input, isUser: true, type: undefined, feedback: undefined}]);

    const prompt = generatePrompt(messages);
    console.log(prompt);

    // const response = await fetch("/api/chat", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     prompt: prompt,
    //   }),
    // });

    // const message = await response.json();
    // var text = message.message.slice(2, message.message.length - 2).split('","').join("");
    // console.log(text);

    var text = "response{Type: 'neutral', Feedback: 'this is feedback'}";

    // const stringWithObject = "\n\n{Type: 'good', Feedback: 'this is feedback'}\n\n";
    // Use a regular expression to find the JSON-like object
    const regex = /\{[^}]+\}/;
    const match = text.match(regex);
    var feedback: {Type: string | undefined, Feedback: string | undefined} = {
      Type: undefined,
      Feedback: undefined
    };

    if (match) {
      const jsonString = match[0];
      text = text.replace(match[0], "");
      const array = jsonString.slice(1, jsonString.length - 1).split(", ");

      for (var item of array) {
        const item_arr = item.split(": ");
        if (item_arr[0] === "Type") feedback.Type = item_arr[1].replace(/'/g, "");
        else if (item_arr[0] === "Feedback") feedback.Feedback = item_arr[1].replace(/'/g, "");
      }
      
      console.log(feedback);
    } else {
      console.log("No match found");
    }


    // addMessages(prompt, true);
    addMessages([{ text: input, isUser: true, type: undefined, feedback: undefined },{ text: text, isUser: false, type: feedback.Type, feedback: feedback.Feedback }]);

  };


    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef<HTMLInputElement>(null);
  
    // Programatically click the hidden file input element
    // when the Button component is clicked
    function handleClick(event: any) {
      event.preventDefault();
      if (hiddenFileInput.current === null) return;
      hiddenFileInput.current.click();
    };
    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file 
    const handleChange = async (event: any) => {
      event.preventDefault();
      console.log("changing");
      const fileUploaded = event.target.files[0];
      const formData = new FormData();
      formData.append('file', fileUploaded);

      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "image/*",
        },
        body: formData
      });

      const message = await response.json();
      console.log(message);
    };



  return (
    <div id="content">
    <Head>
      <title>Replicate + Next.js</title>
    </Head>


    <h1 className="text-center text-xl mt-5">Practice</h1>

    <div className="m-4 border-2 h-96 flex flex-col" id="chatBox">
      {/* <p>{messages}</p> */}
      { messages.map((item, index) => 
          <div key={index} className={"chatMessage " + (item.isUser ? "self-end" : "self-start")}>
            <p>{item.text}</p>
            {item.type !== undefined && item.feedback !== undefined && 
              <span className={(item.type)}>{item.feedback}</span>
            }
          </div>
      )}
    </div>

    <form onSubmit={handleSubmit} className="flex flex-row">
      {/* <input type="text" name="prompt" placeholder="Enter a prompt to display an image" /> */}
      <textarea className="border" rows={2} cols={90} name="prompt" placeholder="Start a conversation!" />
      <button type="submit" className="bg-black text-white w-20" id="prompButton">Go!</button>
      
      {/* <textarea rows={50} cols={50} >hellow</textarea> */}
    </form>

    <form className="flex flex-row justify-center">
      <p className="justify-center align-middle flex flex-col">Upload an image to analyze the body language: </p>
      {/* <input type="file" name="image_upload" id="imageButton"/> */}

      <button className="button-upload p-3 m-4 bg-black text-white" onClick={handleClick}>
        Upload a file
      </button>
      <input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        accept="image/*"
        style={{display: 'none'}} // Make the file input element invisible
      />
    </form>


    
  </div>
  )
}
