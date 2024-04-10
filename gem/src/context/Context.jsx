import { createContext, useState } from "react";
import runChat from "../config/gemini";
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayParan = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoadings(false);
    setShowResult(false);
  };

 const onSent = async (prompt) => {
    setResultData("");
    setLoadings(true);
    setShowResult(true);
    let response ;
    if (prompt !== undefined) {
        response  = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
       response = await runChat(input);
    }
    // setRecentPrompt(input)
    // setPrevPrompt(prev=>[...prev,input])
    // const response = await runChat(input)
    let responseArray = response.split("*");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i == 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayParan(i, nextWord + " ");
    }
    setLoadings(false);
    setInput("");
  };

  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loadings,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
