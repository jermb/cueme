import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: "r8_DJODenIhFhksmbNqCTY4WmK4gzlBrGy4esl9E",
});
// const model = "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3"
const model = "meta/llama-2-7b-chat:13c3cdee13ee059ab779f0291d29054dab00a47dad8261375654de5540165fb0";
// const system = "You are talking to someone who you are meeting for the first time and trying to get to know them. Ask lots of questions and keep the conversation going. Wait for the users response and only ask one question at a time."
const system = "You are trying to help the user improve their social skills. Have a conversation with them on a topic of their choosing and give feedback on their responses. Feedback should be given in short bytes and be sent in the following format {Type: 'good/bad/neutral', Feeback: 'feedback response here'}. Please limit your response length to one question and append the feedback to the end of your message. You should respond in less than 400 characters."

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    console.log(body);

    const output = await replicate.run(model, { 
        input: {
            prompt: body.prompt,
            system_prompt: system
        }
     }).catch(err => {
        console.log(err);
     });
    
    
    return NextResponse.json(
        { message: JSON.stringify(output) },
        { status: 201 }
    );
}