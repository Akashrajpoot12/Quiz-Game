Quiz Game - Interactive Trivia App

<img width="1687" height="913" alt="image" src="https://github.com/user-attachments/assets/5bed8500-ad6d-4747-904c-0399832ac03c" />


Overview
Quiz Game is a modern, responsive single-page web application built with vanilla HTML, CSS, and JavaScript. It fetches trivia questions from the Open Trivia Database API and provides an engaging quiz experience with timers, sound effects, animations, and a sleek glassmorphism UI. Users select from 24+ subjects, answer 10 unique questions per quiz, and receive instant feedback with scores.
Perfect for learning, entertainment, or quick trivia sessions. No backend required—runs entirely in the browser!
Key Features

Subject Selection: Choose from 24 categories (e.g., General Knowledge, Science, Entertainment).
Dynamic Questions: 10 unique multiple-choice questions fetched via API (no duplicates).
30-Second Timer: Per question with visual warnings (yellow at 20s, blinking red at 10s) and auto-advance on timeout.
Sound Effects: Celebratory "ding" for correct answers, "buzz" for wrong/timeout, "beep" for warnings, and "whoosh" for transitions (optional mute toggle).
Modern UI/UX: Glassmorphism design, gradients, animations (fade-ins, bounces, shakes), progress bar, and confetti celebration on score.
Quiz Controls: Cancel quiz anytime, restart, and responsive design for mobile/desktop.
Feedback & Scoring: Highlights correct/wrong answers, tracks score out of 10.
Accessibility: High-contrast colors, keyboard-navigable options, and confirm dialogs.

Demo

Live Demo: Deploy on GitHub Pages or Netlify (host it yourself!)
Screenshots: Add images of subject screen, question view, and score page.

Technologies Used

Frontend: HTML5, CSS3 (with animations and gradients), Vanilla JavaScript (ES6+).
API: Open Trivia Database (free, no API key needed).
Audio: Web Audio API (MP3 files for effects).
Fonts: Google Fonts (Poppins).
No Dependencies: Pure vanilla code—no frameworks like React or libraries.

Installation & Setup

Clone/Download the Project:
textgit clone https://github.com/your-username/quiz-game.git
cd quiz-game
Or download the ZIP from GitHub.
Add Sound Files (Optional for audio features):

Download free MP3s:

correct.mp3: Short ding sound.
wrong.mp3: Buzz sound.
beep.mp3: Alert beep.
whoosh.mp3: Transition whoosh.


Place them in the root folder (next to index.html).


Run Locally:

Open index.html in a modern browser (Chrome, Firefox, Safari).
For development: Use a local server to avoid CORS issues with API (e.g., VS Code Live Server, or npx live-server).


Internet Required: For fetching questions from Open Trivia API. Offline fallback not implemented (easy to add hardcoded questions).

Usage

Select a Subject: Click on a category (e.g., "Science: Computers").
Start Quiz: Click "Start Quiz" to load 10 questions.
Answer Questions: Click an option within 30 seconds. "Next" enables after selection.
Timer & Feedback: Watch the timer; get highlights (green correct, red wrong) and sounds.
Progress: Track via the bottom progress bar.
Cancel/Restart: Use top buttons to bail out or replay.
Score: View final score with confetti! Restart for another round.

Example Flow

Subject: General Knowledge → Loads 10 medium-difficulty questions.
Question 1: "What is the capital of France?" (Options shuffled).
Answer: Select "Paris" → Green highlight + ding → Next.

Customization

Add Subjects: Edit subjects array in script.js (use Open Trivia category IDs).
Question Count/Difficulty: Change amount=10 and difficulty=medium in fetchQuizData().
Timer Duration: Adjust timeLeft = 30; in startTimer().
Colors/Animations: Tweak CSS gradients and keyframes.
More Sounds: Add files and update AudioManager.
Fallback Questions: For offline mode, add a hardcoded quizData array.

Troubleshooting

API Errors: "No questions available"? Try another subject—some categories have limited medium questions. Fallback to general trivia.
CORS Issues: Run via local server (not file:// protocol).
No Sounds: Ensure MP3 files are in the folder; check browser autoplay policies.
Mobile Issues: Test on devices—touch-friendly, but zoom if needed.
Console Errors: Open DevTools (F12) for logs (e.g., network failures).

Contributing

Fork the repo.
Create a feature branch (git checkout -b feature/amazing-new-feature).
Commit changes (git commit -m 'Add amazing new feature').
Push to branch (git push origin feature/amazing-new-feature).
Open a Pull Request.

Ideas: Multiplayer mode, user accounts, custom questions upload, or dark mode toggle. Issues/PRs welcome!
