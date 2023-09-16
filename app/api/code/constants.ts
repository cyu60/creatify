// TODO: tweak this to make it have more of a process?
// 1. Suggest different names
// 2. Generate description based on selected name
// 3. Ask for techstack
// 4. Generate full report

import { ChatCompletionRequestMessage } from "openai";

export const systemPrompt = `
You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.
`;

const exampleProject = `
Project Name: Lunar Explorer

Elevator Pitch: "Embark on a celestial adventure and explore the wonders of the moon with Lunar Explorer. Discover its surface, study its geology, and unlock the secrets of our lunar neighbor."

About the Project: Inspiration: The inspiration for our project came from the fascination with space exploration and the desire to bring the experience of venturing to the moon closer to everyone. We recognized the lack of accessible platforms that allow users to explore the moon digitally and wanted to bridge that gap.

What It Does: Lunar Explorer is a virtual reality (VR) experience that enables users to explore the moon's surface and learn about its geological features. Users can immerse themselves in a realistic lunar environment, navigate using a VR headset and controllers, and interact with various points of interest to obtain information about the moon's formation, craters, and other features. The project aims to provide an educational and awe-inspiring experience for users, igniting their curiosity about space exploration.

How We Built It: To create Lunar Explorer, we utilized Unity, a powerful game development engine, to design and build the VR environment. We also used 3D modeling software to create detailed lunar surface models based on data collected by space agencies. The project involved coding in C# to implement user interactions and navigation within the VR environment. We tested the experience on different VR devices to ensure compatibility and optimize performance.

Challenges We Ran Into: One of the main challenges we faced was sourcing accurate and up-to-date data about the moon's surface. Integrating this data into the VR environment while maintaining performance was also a challenge. Additionally, optimizing the project for different VR devices presented some technical difficulties.

Accomplishments We're Proud Of: We successfully developed a visually stunning and immersive VR experience that captures the essence of exploring the moon. The integration of accurate data and the ability to interact with various elements on the lunar surface were notable achievements. Furthermore, we optimized the project to ensure smooth performance on different VR setups.

What We Learned: Throughout this project, we gained valuable knowledge about Unity game development, working with VR technology, and incorporating real-world data into virtual environments. We also learned the importance of optimization in VR experiences to provide a seamless and enjoyable user journey.

What's Next for Lunar Explorer: In the future, we aim to expand Lunar Explorer by incorporating more interactive elements and educational features. We plan to add guided tours, scientific simulations, and the ability to compare different lunar locations. Additionally, we intend to collaborate with space agencies and experts to ensure the accuracy of the information provided within the experience.`;
export const initialMessage: ChatCompletionRequestMessage[] = [{
  role: "system",
  content: systemPrompt,
}, {
    role: "system",
    content: "Ouput in Markdown with seperate headers"
}];
export const testMessages: ChatCompletionRequestMessage[] = [
  {
    role: "user",
    content: "nice",
  },
  {
    role: "assistant",
    content: exampleProject,
  },
  {
    role: "user",
    content: "cool",
  },
];
