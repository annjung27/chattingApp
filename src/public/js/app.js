const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const nickName = document.getElementById("name");
const nicknameForm = welcome.querySelector("#name");
const roomNameForm = welcome.querySelector("#roomname");

room.hidden = true;
nicknameForm.hidden = false;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.emit("nickname", input.value);
  nicknameForm.hidden = true;
  const savedNickname = welcome.querySelector("h3");
  const h3 = document.createElement("h3");
  h3.innerText = `Welcome ${input.value}!`;
  savedNickname.append(h3);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomNameForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

roomNameForm.addEventListener("submit", handleRoomSubmit);
nicknameForm.addEventListener("submit", handleNicknameSubmit);

// show message when user joined the room
socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} joined!`);
});

// show message when user leaving the room
socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left😢`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
