# Spec Requirements: Grammar Multiple Choice Game

## Initial Description
Add a new grammar game where users complete sentences by choosing the correct form from multiple choice options (a/b/c). The game should:
- Present a sentence with a blank to fill in
- Show multiple choice options (a/b/c) where one is correct
- Other options contain incorrect grammatical forms
- Example: "have got" vs "has got" exercise

The user provided an example image showing a worksheet-style exercise with 20 sentences testing "have got/has got" usage.

## Requirements Discussion

### Initial Clarifying Questions

**Q1:** What specific grammar topic should this game focus on?
**Answer:** Focus exclusively on "have got/has got" grammar for V1.

**Q2:** Should the game follow the same mechanics as existing games (2 attempts, encouraging feedback, auto-advance)?
**Answer:** Yes, follow the PluralFormsScreen pattern exactly - 2 attempts, encouraging feedback, and auto-advance after correct answer or 2 failed attempts.

**Q3:** Should the game support both English and Slovenian like other games?
**Answer:** English only, no Slovenian translations needed.

**Q4:** How many questions should be included per round, and how many total examples?
**Answer:** 10 questions per round, 30 total examples in the database.

**Q5:** Should the game use the same scoring system as existing games?
**Answer:** Yes, use the same scoring system as existing games.

**Q6:** For the home screen, should this game have its own dedicated button?
**Answer:** Yes, add a dedicated button labeled "Dopolni stavke" on the home screen.

**Q7:** Are there any features we should explicitly exclude from V1?
**Answer:** Exclude difficulty levels, time limits, and mixing different grammar topics.

### Follow-up Questions

**Follow-up 1:** What variations should be included as wrong answer options in the multiple choice?
**Answer:** Include variations like "have got", "has got", "having got", "got", etc. as wrong answers.

**Follow-up 2:** Should the multiple choice answers be presented in a specific format (buttons, radio buttons, etc.)?
**Answer:** Use a/b/c buttons similar to PluralFormsScreen.

**Follow-up 3:** Can you provide a reference to the PluralFormsScreen for UI consistency?
**Answer:** User added PluralFormsScreen.png to visuals folder.

**Follow-up 4:** Should we create exactly 30 examples, or is there flexibility in introducing new sentence patterns?
**Answer:** Create 30 examples total; can introduce new sentence patterns if they make sense grammatically.

### Existing Code to Reference

**Similar Features Identified:**
- Feature: PluralFormsScreen - The UI pattern, mechanics, and layout should match this existing screen
- Reference: Visual mockup provided showing the exact UI pattern to follow

No specific file paths were provided, but the PluralFormsScreen visual shows the exact pattern to replicate.

## Visual Assets

### Files Provided:
- `examples.png`: Original worksheet showing 20 "have got/has got" sentence completion exercises. Sentences include:
  1. My sisters _______ long hair.
  2. I can't open the door. I _______ a key. (-)
  3. We _______ an apple tree in the garden.
  4. Robert _______ a lot of friends in school. (-)
  5. They _______ two cats and a dog.
  6. Ben _______ a lot of books. (-)
  7. My parents _______ enough time to go on holidays.
  8. My friend _______ an orange basketball.
  9. Betty and Frank _______ a really nice aunt.
  10. Cheer up! We _______ much time. (-)
  11. My parents _______ a big bedroom.
  12. My uncle _______ a son or a daughter. (-)
  13. The twin sisters in our class _______ pretty eyes.
  14. We _______ a red sofa in our classroom.
  15. My hamster _______ a very soft fur.
  16. She wants new jeans, but she _______ the money. (-)
  17. Our English teacher _______ a beard. (-)
  18. I _______ a big flat screen in my room.
  19. My brother _______ long black hair.
  20. Me and my brother _______ a computer. (-)

  Note: (-) indicates negative form usage in the worksheet

- `PluralFormsScreen.png`: Reference UI showing the exact layout pattern to follow. Key elements:
  - Back button ("Nazaj") in top left
  - Progress indicator showing "1/10" and "10%" with purple progress bar
  - Title showing "Beseda 1/10"
  - White card containing the question
  - Audio playback button ("Poslušaj") with speaker icon
  - Three multiple choice buttons (a/b/c) with rounded borders and letter labels in purple circles
  - Score display at bottom showing "0 / 10" with "Rezultat" label
  - Yellow points badge showing "0 točke"

### Visual Insights:
- **Design Pattern**: Clean, card-based layout with clear hierarchy
- **User Flow**: Question at top, audio option, multiple choice selection, score tracking at bottom
- **UI Components**:
  - Progress bar (horizontal, purple fill)
  - Large rounded button for audio/action
  - Multiple choice buttons with letter indicators (a/b/c format)
  - Score display with count and badge
- **Color Scheme**: Purple primary color, white background, yellow accent for scoring
- **Fidelity Level**: High-fidelity mockup showing exact production UI
- **Typography**: Clear, readable fonts with question as main focus
- **Spacing**: Generous padding around elements, clear visual separation

## Requirements Summary

### Functional Requirements
- Present sentences with blanks where users must choose correct "have got" or "has got" form
- Display three multiple choice options (a/b/c) per question
- Include grammatical variations as wrong answers (e.g., "have got", "has got", "having got", "got")
- Allow 2 attempts per question
- Show encouraging feedback after incorrect attempts
- Auto-advance after correct answer or 2 failed attempts
- Track score throughout the round
- Display 10 questions per round
- Support multiple rounds using 30 total example sentences
- Add dedicated home screen button labeled "Dopolni stavke"

### Non-Functional Requirements
- UI must match PluralFormsScreen layout exactly
- Use same color scheme (purple primary, white background, yellow scoring)
- Maintain consistent spacing and typography with existing screens
- Follow same game mechanics as PluralFormsScreen (2 attempts, feedback, auto-advance)
- English language only for V1

### Content Requirements
- Create 30 total sentence examples testing "have got/has got"
- Use the 20 examples from worksheet as starting point
- Can introduce new sentence patterns if grammatically appropriate
- Include both affirmative and negative usage patterns
- Ensure subject-verb agreement rules are clearly tested
- Mix singular subjects (requiring "has got") and plural subjects (requiring "have got")

### Reusability Opportunities
- Replicate PluralFormsScreen UI layout and structure
- Use same progress indicator component
- Use same multiple choice button styling (a/b/c format)
- Use same scoring display format
- Follow same game flow logic (attempts, feedback, auto-advance)
- Adapt existing audio button pattern if needed
- Use same navigation patterns (back button)

### Scope Boundaries
**In Scope:**
- "Have got/has got" grammar focus only
- 30 example sentences (10 per round, 3 rounds)
- Multiple choice with 3 options (a/b/c)
- 2 attempts per question
- Encouraging feedback
- Score tracking
- Home screen button addition
- UI matching PluralFormsScreen pattern
- English language only

**Out of Scope:**
- Difficulty levels (all questions at same level)
- Time limits or timed challenges
- Mixing different grammar topics
- Slovenian translations
- Audio pronunciation (unless PluralFormsScreen audio is for pronunciation)
- User progress tracking across sessions (unless existing games have this)
- Leaderboards or comparative scoring

### Technical Considerations
- Must integrate with existing game architecture
- Follow same scoring system as existing games
- Use consistent data structure for questions/answers
- Add new home screen button without disrupting existing layout
- Ensure question randomization works within rounds
- Store 30 examples in appropriate data structure/database
- Follow same routing patterns as existing games
- Match existing game state management approach

### Design Specifications (from PluralFormsScreen.png)
- **Layout**: Centered card-based design
- **Progress Bar**: Horizontal, purple fill, showing X/10 and percentage
- **Question Card**: White background, rounded corners, generous padding
- **Multiple Choice Buttons**:
  - Three stacked buttons (a/b/c)
  - Letter indicators in purple circles on left
  - Rounded borders
  - Full width
  - Clear spacing between options
- **Score Display**: Bottom section with count (X / 10) and yellow points badge
- **Navigation**: Back button ("Nazaj") in top left
- **Typography**: Question text centered and prominent
