# Problem statement

Create an expense sharing application(GUI or command line).

An expense sharing application is where you can add your expenses and split it among people. The application keeps balances between people as in who owes how much to whom.

# Example

You live with 3 other friends.
You: User1 (id: u1)
Flatmates: User2 (u2), User3 (u3), User4 (u4)

This month's electricity bill was Rs. 1000.
Now you can just go to the app and add that you paid 1000,
select all the 4 people and then select split equally.
Input: u1 1000 4 u1 u2 u3 u4 EQUAL

For this transaction, everyone owes 250 to User1.
The app should update the balances in each of the profiles accordingly.

User2 owes User1: 250 (0+250)
User3 owes User1: 250 (0+250)
User4 owes User1: 250 (0+250)

---

Now, It is the BBD sale on Flipkart and there is an offer on your card.
You buy a few stuffs for User2 and User3 as they asked you to.
The total amount for each person is different.
Input: u1 1250 2 u2 u3 EXACT 370 880

For this transaction, User2 owes 370 to User1 and User3 owes 880 to User1.

The app should update the balances in each of the profiles accordingly.
User2 owes User1: 620 (250+370)
User3 owes User1: 1130 (250+880)
User4 owes User1: 250 (250+0)

---

Now, you go out with your flatmates and take your brother/sister along with you.
User4 pays and everyone splits equally. You owe for 2 people.
Input: u4 1200 4 u1 u2 u3 u4 PERCENT 40 20 20 20

For this transaction, User1 owes 480 to User4, User2 owes 240 to User4 and User3 owes 240 to User4.

The app should update the balances in each of the profiles accordingly.
User1 owes User4: 230 (250-480)
User2 owes User1: 620 (620+0)
User2 owes User4: 240 (0+240)
User3 owes User1: 1130 (1130+0)
User3 owes User4: 240 (0+240)

# Requirements

- User: Each user should have a userId, name, email, mobile number.
- Expense: Could either be EQUAL, EXACT or PERCENT
- Users can add any amount, select any type of expense and split with any of the available users.
- The percent and amount provided could have decimals upto two decimal places.
- In case of percent, you need to verify if the total sum of percentage shares is 100 or not.
- In case of exact, you need to verify if the total sum of shares is equal to the total amount or not.
- The application should have a capability to show expenses for a single user as well as balances for everyone.
- When asked to show balances, the application should show balances of a user with all the users where there is a non-zero balance.
- The amount should be rounded off to two decimal places. Say if User1 paid 100 and amount is split equally among 3 people. Assign 33.34 to first person and 33.33 to others.

**You can either create a simple UI for this to allow user to perfrom these operations Or You can create a CLI application**.

# Expectations

- Make sure you have working and demonstratable code.
- Code should be modular and readable (would suggest you to use class based model)
- Separation of concern should be addressed.
- Code should easily accommodate new requirements with minimal changes.

If you plan to go with CLI based app(not recommended though. try to create simple GUI). Please follow following Input/Output model

## Input

- There will be 4 types of input:
  - `CREATE_USER <name> <email> <mobile-number>` (it should return User ID)
  - Expende in the format: `EXPENSE <user-id-of-person-who-paid> <no-of-users> <space-separated-list-of-users> <EQUAL/EXACT/PERCENT> <space-separated-values-in-case-of-non-equal>`
  - Show balances for all: `SHOW`
  - Show balances for a single user: `SHOW <user-id>`

## Output

- When asked to show balance for a single user. Show all the balances that user is part of:
- `Format: <user-id-of-x> owes <user-id-of-y>: <amount>`
- If there are no balances for the input, print `No balances`
- In cases where the user for which balance was asked for, owes money, they’ll be x. They’ll be y otherwise.

Refer file `sampleInput.txt` and `sampleOutput.txt` to see example Input and Output.

Problem statement credit: [workat.tech](https://workat.tech/)
