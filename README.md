# Members Only
<p><a href="https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs/lessons/members-only">link</a> to Project: Members Only

<p>A message board where users can post messages. Only club members can see who posted the messages</p>

## Installation
<p>Requires</p>
<ul>
	<li>npm</li>
	<li>A MongoDB account</li>
</ul>

<p>To run:</p>
<p>
	<code>npm install</code> in the root directory<br />
	create a .env file<br />
	put MongoDB's connection string with db specified under MONGODB_URI in .env (remember to encode non alphanumeric characters)<br />
	put a random string as SESSION_SECRET in .env for express-session<br />
	<code>npm start</code> in root directory<br />
	then, go to <a href='localhost:3000'>localhost:3000</a>
</p>

<p>Visit my working demo at <a href="https://private-message-board.herokuapp.com/">https://private-message-board.herokuapp.com/</a> and try the code jointheclub</p>
