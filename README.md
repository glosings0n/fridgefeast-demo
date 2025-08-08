# Prototype's Demo in Firebase Studio

This is a `NextJS` starter in **Firebase Studio** to demonstrate how to prototype applications in Firebase Studio and eventually host them on an external service like **[Vercel](https://vercel.com)**.

The plans that were followed were:
1. Prototyping via a prompt suggested in Firebase Studio directly, the one for *"Fridge Feast"*
2. Debugging system (in the prototyping section, in the Firebase Studio IDE, etc.)
3. Then, how to connect this project to GitHub
4. How to deploy it to Vercel via GitHub
5. A final point was to ensure that the AI key works once deployed, as this is the major concern.

## How to start the project?

To get started, ensure to follow this step :
1. Clone the repository in your local PC by running the following command in the folder where you want to clone the project (Make sure you have `[git](https://git-scm.com/)` installed) :
  ```
  git clone https://github.com/glosings0n/fridgefeast-demo
  ```

2. Run `npm i` to install all necessary dependencies for this project (You should have `npm` installed on your PC)
3. Generate a *GEMINI API Key* in **[Google AI Studio](https://ai.dev)** for this project
4. Then, paste it in an environmental variable named `GEMINI_API_KEY` in the `.env` file that you should create in the root of your project

---
`By @glosings0n 2k25`
