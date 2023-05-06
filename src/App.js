import { useState } from "react";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "generated_image.png";
    link.href = imageUrl;
    link.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // generate business name and tagline using OpenAI's GPT-3 API
    const businessNameResponse = await fetch(
      "https://api.openai.com/v1/engines/text-davinci-002/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:"Bearer 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",
        },
        body: JSON.stringify({
          prompt: `Generate a business name for an ${inputValue}`,
          max_tokens: 50,
        }),
      }
    );
    const businessNameData = await businessNameResponse.json();
    const businessName = businessNameData.choices[0].text.trim();
  
    const taglineResponse = await fetch(
      "https://api.openai.com/v1/engines/text-davinci-002/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:"Bearer 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",
        },
        body: JSON.stringify({
          prompt: `Generate a tagline for an ${inputValue} business`,
          max_tokens: 50,
        }),
      }
    );

    const taglineData = await taglineResponse.json();
    const tagline = taglineData.choices[0].text.trim();
  
    // use OpenAI's DALL-E API to generate an image based on user input
    const imageResponse = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:"Bearer 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",
        },
        body: JSON.stringify({
          model: "image-alpha-001",
          prompt: `${inputValue} ${businessName} ${tagline}`,
        }),
      }
    );
  
    // get the image URL from the API response and update the state
    const imageData = await imageResponse.json();
    setImageUrl(imageData.data[0].url);
    setCaption(`${businessName}\n${tagline}`);
    setIsLoading(false);
  };
  
  
  
  return (
    <div className=" text-center lg:w-1/2 sm:w-full md:w-4/5 m-auto bg-gray-100">
      <div className="w-full flex bg-purple-700 h-16 items-center justify-center">
        <h1 className="text-white text-2xl font-bold">Generative AI App</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-1.5 mb-2">
        <div className="mt-7 lg:flex lg:justify-around md:flex md:justify-around items-center">
          <div className="lg:flex mr-1.5 p-1.5">
            <label htmlFor="input" className="p-1.5">
              Enter your input:
            </label>
            <input
              type="text"
              onChange={(e) => setInputValue(e.target.value)}
              name="text"
              id="input"
              className="block w-full sm:w-1/2 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              placeholder="Type here"
            />
          </div>
          <div>
            <button
              type="submit"
              className="rounded-md bg-purple-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Generate Image
            </button>{" "}
          </div>
        </div>
      </form>
      {isLoading && (
        <div className="container">
          <div className="text-white text-2xl">Loading</div>
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
        </div>
      )}
      {imageUrl && (
        <>
          <div className="aspect-h-1 aspect-w-1 w-full rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
            <img
              src={imageUrl}
              alt="Generated"
              title={inputValue}
              className="h-1/2 w-full object-center group-hover:opacity-75"
            />
          </div>
          <div className="mt-1.5 mb-1.5  py-1.5">
            <p className="mt-8 text-base text-gray-500">{caption}</p>
          </div>
          <button
            onClick={handleDownload}
            className="rounded-md bg-purple-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Download
          </button>
        </>
      )}
    </div>
  );
}

export default App;
