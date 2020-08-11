import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import Messages from "../Messages/Messages";
import Input from "../Input/Input";

import onlineIcon from "../icons/onlineIcon.png";
import "./Quiz.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "../../../websocket";

/* should render base on whether student or teacher (not yet implemented)
  teacher can add question using addQuestion.   This sends "addQuestion" to user.room which sends "updateQuiz" to student. 
  
  Teacher can reset paper using reset().   
  Reset answers and questions.
  This sends "reset" to user.room which sends submit to student.
  student sends "submit" and (name, mark) to user.room.
  user.room sends "collect" and (name, mark) to teacher.
  */

const Quiz = ({ removeElement }) => {
  const name = localStorage.getItem("user") + " quiz taker";
  const room = localStorage.getItem("room") + " quiz";

  const [users, setUsers] = useState("");
  const [index, setIndex] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0)
  const [class_score, setClassScore] = useState([])


  useEffect(()=> {
    socket.emit("quizJoin", { name, room }, error => {
      if (error) {
        alert(error);
       window.location.reload(false);
      }
    })
    socket.on("receiveQuizMessage", message => {
      console.log("iii");
      setQuestions(messages => [...messages, message]);
    })
    socket.on("quizRoomData", ({ users }) => {
      setUsers(users);
    })

    socket.on("updateQuiz", (message) => {
      console.log(message)
      setQuestions([questions, message.question]);
      setAnswers([answers, message.answer]);
    })

    socket.on("submit", (message) => {
      const result= {
        "name": name,
        "score": score
      }
      socket.emit("submit", result)
    })

    socket.on("collect", (result) => {
      setClassScore([...class_score, result])
    })
    
  }, [])

  //Resets quiz and asks for marks
  const reset = () => {
    socket.emit("reset");
    setQuestions([]);
    setAnswers([]);
  }


  const addQuestion = (question, answer) => {
    const message= {
      "question": question,
      "answer": answer
    }
    socket.emit("addQuestion", message);
  };

  const ansQuestion = (index, answer) => {
    if(answer == answers[index]) {
      setScore(score + 1);
    }
    setIndex(index + 1);
  }

  return (
    <div className="container">
      <div className="infoBar">
        <div className="leftInnerContainer">
          <img className="onlineIcon" src={onlineIcon} alt="online icon" />
          <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
          <span className={"delete-btn"} onClick={() => removeElement()}>
            X
          </span>
        </div>
      </div>

      <Messages messages={questions} name={name} />
      <Input
        message={index}
        setMessage={setIndex}
        sendMessage={ansQuestion}
      />
    </div>
  );
};

export default Quiz;
