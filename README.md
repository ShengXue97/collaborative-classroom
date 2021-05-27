# Collaborative Classroom

## What it does
While there exists many apps that allow for some form of online collaboration, they fall short when it comes to creating an ideal online classroom environment. This app aims to provide TAs and students with all the features they would need to conduct a conducive classroom. Some notable features include a real-time whiteboard, real-time quiz conducting feature, and a personal messaging system.

## How I built it
This website is with React as the frontend, with a NodeJS backend server.

### Whiteboard:
Consists of a classroom whiteboard and a private board.
Allows two-way communication between students, such as collaboration between student and teacher, or in group discussion.
Zoom does not have two-way Whiteboard and sharing feature, while Microsoft Teams allows screen sharing but no whiteboard sharing.
Whiteboard sharing allows for innovative teaching.
Video/Audio sharing:
Allows for video and audio streaming as well as screen sharing. 2.Facilitates communication and encourages student participation. Allows for 2 way interaction between student and teacher.

### Real time quiz maker/ taker:
Allows the teacher to effectively test the knowledge of the students in real-time, to reinforce learning 2.The quiz feature is split into 2 components:
A quiz maker for the teacher to create quizzes and view the results of the students in real-time.
A quiz taker and score system for students to answer questions in real time, and keeps track of their results.
Real-time messaging both in room and privately
Room messaging allows instant communication between teachers and students in the same tutorial room
Private messaging allows the users to communicate even if they are not in the same tutorial room. There is also an unread messages support, which allows the users to track messages quickly.
Unlike Luminus quizes, Collaborative Classroom allows for interactive evaluation and discussion of answers.

## Challenges I ran into
Bugs. Lots of nasty bugs. As this application involves persistent data in the database as well as real-time communication between users, it tends to be vulnerable to bugs.

Moreover, we gained further insight into software development and the challenges of implementing a real-time service. Through this experience, we have become more aware of the possible pitfalls and common bugs in developing our server, and will be able to better lookout for them when writing code in future.

## Accomplishments that I'm proud of
We believe that we have become better software developers through this experience. This website consists of many libraries weaved together in an innovative way. This includes the video/screen sharing, realtime-whiteboard, react grid layout, and socket programming. We are proud that we have managed to bring these libraries together into a single working product for both students and teachers.

## What I learned
We have become more familiar with web development and how bugs could have been avoided with better coding practices.

Why websites are down sometimes. An accident push to the production server can cause the public website to be down!

## What's next for Collaborative Classroom
NUS Should take us up on the idea, as this provides a conducive environment for students to work together just like in real tutorial rooms.

In addition, other universities and schools in general could use our app. Try it out Education is fun!
