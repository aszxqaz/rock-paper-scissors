empty:
	node dist/main.js

below-3:
	node dist/main.js one two

not-even:
	node dist/main.js one two three four

duplicate:
	node dist/main.js one two two

start-3:
	node dist/main.js Rock Paper Scissors

start-5:
	node dist/main.js Rock Paper Scissors 4th 5th

start-7:
	node dist/main.js Rock Paper Scissors 4th 5th 6th 7th