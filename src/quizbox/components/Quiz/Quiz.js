import { MDBBtn, MDBListGroup, MDBListGroupItem, MDBContainer } from "mdbreact";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdbreact";
import React, { useEffect, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import socket from "../../../websocket";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function CallResize(props) {
  useInterval(() => {
    props.resize(true);
  }, 1000);

  return <div />;
}

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    const str = "#whiteboard";
    var tempWidth = 4 * 63.5 + "px";
    var tempHeight = 4 * 148 + "px";

    const user = localStorage.getItem("user");
    const initialScoreData = {};
    initialScoreData[user] = 0;

    this.state = {
      quizData: [],
      currentQuestion: 0,
      myAnswer: null,
      options: [],
      score: 0,
      disabled: true,
      isEnd: false,
      hasQuiz: false,
      creatingQuiz: false,
      width: tempWidth,
      height: tempHeight,
      teacherQuiz: [],
      teacherQuestionNumber: 1,
      teacherQuestionTitle: "",
      teacherQuestionOption1: "",
      teacherQuestionOption2: "",
      teacherQuestionOption3: "",
      teacherQuestionOption4: "",
      teacherQuestionAnswer: "",
      scoreData: initialScoreData,
      dummy: 0,
    };
  }

  loadQuizData = () => {
    // console.log(quizData[0].question)
    this.setState(() => {
      return {
        questions: this.state.quizData[this.state.currentQuestion].question,
        answer: this.state.quizData[this.state.currentQuestion].answer,
        options: this.state.quizData[this.state.currentQuestion].options,
      };
    });
  };

  componentDidMount() {
    this.props.onRef(this);
    console.log(this.props.id);
    var parentElement = document.getElementById(this.props.id);
    var childElement = document.getElementById("quizBoxInternal");
    console.log(parentElement);
    console.log(childElement);
    console.log(parentElement.style.height);
    console.log(childElement.style.height);

    childElement.style.width = parentElement.style.width;
    parentElement.style.height = childElement.style.height;

    socket.on("newQuiz", message => {
      console.log(message);
      this.addQuiz(message.message);
    });

    socket.on("newUser", message => {
      console.log(message);
      this.addUser(message);
    });

    socket.on("newScore", message => {
      const user = message.message.user;
      const score = message.message.score;
      this.addScore(user, score);
    });

    socket.on("freshRoomData", message => {
      message.users.map((element, index) => {
        const user = element.name;
        if (user in this.state.scoreData) {
          this.state.scoreData[user] = this.state.scoreData[user];
        } else {
          this.state.scoreData[user] = 0;
        }
        this.setState({
          dummy: this.state.dummy + 1,
        });
      });
    });
  }

  addScore(user, score) {
    if (user in this.state.scoreData) {
      this.state.scoreData[user] = this.state.scoreData[user] + score;
    } else {
      this.state.scoreData[user] = score;
    }
    console.log(this.state.scoreData);
    this.setState({
      dummy: this.state.dummy + 1,
    });
  }

  addUser(newUser) {
    this.state.scoreData[newUser] = 0;
    console.log(this.state.scoreData);
    this.setState({
      dummy: this.state.dummy + 1,
    });
  }

  addQuiz(newQuiz) {
    this.setState({
      quizData: newQuiz,
      hasQuiz: "true,",
      currentQuestion: 0,
      isEnd: false,
    });
    this.loadQuizData();
  }

  resize(snap) {
    console.log("res");
    var parentElement = document.getElementById(this.props.id);
    var childElement = document.getElementById("quizBoxInternal");
    console.log(parentElement);
    console.log(childElement);
    console.log(parentElement.style.height);
    console.log(childElement.style.height);

    childElement.style.width = parentElement.style.width;
    parentElement.style.height = childElement.style.height;
  }

  nextQuestionHandler = () => {
    // console.log('test')
    const { myAnswer, answer, score } = this.state;

    if (myAnswer === answer) {
      this.setState({
        score: score + 1,
      });
    }

    this.setState({
      currentQuestion: this.state.currentQuestion + 1,
    });
    console.log(this.state.currentQuestion);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentQuestion !== prevState.currentQuestion) {
      this.setState(() => {
        return {
          disabled: true,
          questions: this.state.quizData[this.state.currentQuestion].question,
          options: this.state.quizData[this.state.currentQuestion].options,
          answer: this.state.quizData[this.state.currentQuestion].answer,
        };
      });
    }
  }
  //check answer
  checkAnswer = answer => {
    this.setState({ myAnswer: answer, disabled: false });
  };
  finishHandler = () => {
    if (this.state.currentQuestion === this.state.quizData.length - 1) {
      this.setState({
        isEnd: true,
      });
    }
    if (this.state.myAnswer === this.state.answer) {
      this.setState({
        score: this.state.score + 1,
      });
    }
  };
  render() {
    const {
      scoreData,
      creatingQuiz,
      hasQuiz,
      options,
      myAnswer,
      currentQuestion,
      isEnd,
      teacherQuiz,
      teacherQuestionNumber,
      teacherQuestionTitle,
      teacherQuestionOption1,
      teacherQuestionOption2,
      teacherQuestionOption3,
      teacherQuestionOption4,
      teacherQuestionAnswer,
    } = this.state;

    var content = null;
    if (this.props.isAdmin) {
      if (creatingQuiz) {
        content = (
          <>
            <MDBCard
              id={"quizBoxInternal"}
              style={{ width: "300px", height: "500px" }}
              cascade
            >
              <MDBCardBody cascade>
                <div style={{ display: "flex", flexDirection: "column" }}></div>
                <MDBCardTitle>Question {teacherQuestionNumber}</MDBCardTitle>
                <hr />
                <TextField
                  onChange={e => {
                    this.setState({ teacherQuestionTitle: e.target.value });
                  }}
                  value={teacherQuestionTitle}
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                />
                <TextField
                  onChange={e => {
                    this.setState({ teacherQuestionOption1: e.target.value });
                  }}
                  value={teacherQuestionOption1}
                  id="outlined-basic"
                  label="Option 1"
                  variant="outlined"
                />
                <TextField
                  onChange={e => {
                    this.setState({ teacherQuestionOption2: e.target.value });
                  }}
                  value={teacherQuestionOption2}
                  id="outlined-basic"
                  label="Option 2"
                  variant="outlined"
                />
                <TextField
                  onChange={e => {
                    this.setState({ teacherQuestionOption3: e.target.value });
                  }}
                  value={teacherQuestionOption3}
                  id="outlined-basic"
                  label="Option 3"
                  variant="outlined"
                />
                <TextField
                  onChange={e => {
                    this.setState({ teacherQuestionOption4: e.target.value });
                  }}
                  value={teacherQuestionOption4}
                  id="outlined-basic"
                  label="Option 4"
                  variant="outlined"
                />
                <TextField
                  onChange={e => {
                    this.setState({ teacherQuestionAnswer: e.target.value });
                  }}
                  value={teacherQuestionAnswer}
                  id="outlined-basic"
                  label="Answer"
                  variant="outlined"
                />
                <div />
                <MDBCardText>
                  <MDBBtn
                    onClick={() => {
                      const newQuestion = {
                        id: teacherQuestionNumber,
                        question: teacherQuestionTitle,
                        options: [
                          teacherQuestionOption1,
                          teacherQuestionOption2,
                          teacherQuestionOption3,
                          teacherQuestionOption4,
                        ],
                        answer: teacherQuestionAnswer,
                      };
                      teacherQuiz.push(newQuestion);

                      this.setState({
                        teacherQuestionNumber: teacherQuestionNumber + 1,
                        teacherQuestionTitle: "",
                        teacherQuestionOption1: "",
                        teacherQuestionOption2: "",
                        teacherQuestionOption3: "",
                        teacherQuestionOption4: "",
                        teacherQuestionAnswer: "",
                      });
                    }}
                  >
                    Add Question
                  </MDBBtn>

                  <MDBBtn
                    onClick={() => {
                      const newQuestion = {
                        id: teacherQuestionNumber,
                        question: teacherQuestionTitle,
                        options: [
                          teacherQuestionOption1,
                          teacherQuestionOption2,
                          teacherQuestionOption3,
                          teacherQuestionOption4,
                        ],
                        answer: teacherQuestionAnswer,
                      };
                      teacherQuiz.push(newQuestion);
                      console.log(teacherQuiz);
                      socket.emit("shareQuiz", teacherQuiz);
                      this.setState({
                        creatingQuiz: false,
                        teacherQuiz: [],
                        teacherQuestionNumber: 1,
                        teacherQuestionTitle: "",
                        teacherQuestionOption1: "",
                        teacherQuestionOption2: "",
                        teacherQuestionOption3: "",
                        teacherQuestionOption4: "",
                        teacherQuestionAnswer: "",
                      });
                    }}
                  >
                    Share Quiz
                  </MDBBtn>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </>
        );
      } else {
        content = (
          <>
            <MDBCard
              id={"quizBoxInternal"}
              style={{ width: "300px", height: "500px" }}
              cascade
            >
              <MDBCardBody cascade>
                <MDBCardTitle>Create a quiz for your students!</MDBCardTitle>
                <hr />
                <MDBCardText>
                  Score Chart:
                  <MDBContainer>
                    <MDBListGroup>
                      {Object.keys(scoreData).map(user => (
                        <MDBListGroupItem key={user}>
                          {user} : {scoreData[user]}
                        </MDBListGroupItem>
                      ))}
                    </MDBListGroup>
                  </MDBContainer>
                </MDBCardText>
                <hr />
                <MDBCardText>
                  <MDBBtn
                    onClick={() => {
                      this.setState({ creatingQuiz: true });
                    }}
                  >
                    Create Quiz
                  </MDBBtn>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </>
        );
      }
    } else if (!hasQuiz) {
      content = (
        <>
          <MDBCard
            id={"quizBoxInternal"}
            style={{ width: "300px", height: "500px" }}
            cascade
          >
            <MDBCardBody cascade>
              <MDBCardTitle>No quiz sent from teacher yet.</MDBCardTitle>
              <hr />
              <MDBCardText>
                Please wait for your teacher to send a quiz.
              </MDBCardText>
              <hr />
              <MDBCardText>
                <MDBContainer>
                  <MDBListGroup>
                    {Object.keys(scoreData).map(user => (
                      <MDBListGroupItem key={user}>
                        {user} : {scoreData[user]}
                      </MDBListGroupItem>
                    ))}
                  </MDBListGroup>
                </MDBContainer>
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </>
      );
    } else if (isEnd) {
      content = (
        <>
          <MDBCard
            id={"quizBoxInternal"}
            style={{ width: "300px", height: "500px" }}
            cascade
          >
            <MDBCardBody cascade>
              <MDBCardTitle>
                Game Over your Final score is {this.state.score} points
              </MDBCardTitle>
              <hr />
              <MDBCardText>
                The correct answer's for the questions was
              </MDBCardText>
              <hr />
              <MDBCardText>
                <MDBContainer>
                  <MDBListGroup>
                    {this.state.quizData.map((item, index) => (
                      <MDBListGroupItem key={index}>
                        {item.answer}
                      </MDBListGroupItem>
                    ))}
                  </MDBListGroup>
                </MDBContainer>
              </MDBCardText>
            </MDBCardBody>

            <div className="rounded-bottom mdb-color lighten-3 text-center pt-3">
              <MDBBtn
                onClick={() => {
                  const newMessage = {
                    user: localStorage.getItem("user"),
                    score: this.state.score,
                  };
                  socket.emit("shareScore", newMessage);
                  this.setState({
                    currentQuestion: 0,
                    score: 0,
                    hasQuiz: 0,
                  });
                }}
                className="ui inverted MDBBtn"
              >
                End Quiz
              </MDBBtn>
            </div>
          </MDBCard>
        </>
      );
    } else {
      content = (
        <>
          <MDBCard
            id={"quizBoxInternal"}
            style={{ width: "300px", height: "500px" }}
            cascade
          >
            <MDBCardBody cascade>
              <MDBCardTitle>{this.state.questions}</MDBCardTitle>
              <hr />
              <MDBCardText>
                {`Questions ${currentQuestion}  out of ${this.state.quizData
                  .length - 1} remaining `}
              </MDBCardText>
              <hr />
              <MDBCardText>
                <MDBContainer>
                  <MDBListGroup>
                    {options.map(option => (
                      <MDBListGroupItem
                        key={option.id}
                        onClick={() => this.checkAnswer(option)}
                        active={myAnswer === option}
                      >
                        {option}
                      </MDBListGroupItem>
                    ))}
                  </MDBListGroup>
                </MDBContainer>
              </MDBCardText>
            </MDBCardBody>

            <div className="rounded-bottom mdb-color lighten-3 text-center pt-3">
              {currentQuestion < this.state.quizData.length - 1 && (
                <MDBBtn
                  className="ui inverted MDBBtn"
                  disabled={this.state.disabled}
                  onClick={this.nextQuestionHandler}
                >
                  Next
                </MDBBtn>
              )}
              {/* //adding a finish MDBBtn */}
              {currentQuestion === this.state.quizData.length - 1 && (
                <MDBBtn
                  className="ui inverted MDBBtn"
                  onClick={this.finishHandler}
                >
                  Finish
                </MDBBtn>
              )}
            </div>
          </MDBCard>
        </>
      );
    }
    return (
      <>
        <div className="infoBar">
          <div className="leftInnerContainer">
            <p
              style={{
                paddingTop: "15px",
                paddingLeft: "10px",
                fontSize: "20px",
                color: "white",
              }}
            >
              Quiz Box
            </p>
          </div>
          <div className="rightInnerContainer">
            <span
              className={"delete-btn"}
              onClick={() => this.props.removeElement()}
            >
              X
            </span>
          </div>
        </div>
        {content}
      </>
    );
  }
}

export default Quiz;
