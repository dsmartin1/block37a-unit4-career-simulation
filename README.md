# Block 37A Career Simulation (Core)

## Overview
In this Career Simulation, Calliope asks you to create the back end of a review site for one of Fullstack Solutions' clients. After the back end has been completed, the client will review and provide feedback for improvement before starting the front end at a later time.

## Instructions
Calliope has requested that you build the back end first at the client's request. In order for you to have a full understanding of the full stack application, review the following requirements for each user experience: 

AS A USER (NOT LOGGED IN), I SHOULD BE ABLE TO:
- Access the website via the Internet so I can browse and read reviews.
- View details for a specific reviewed item (store, restaurant, product, book, etc.)
    - I should be able to see the item’s average score or rating.
    - I should be able to see any relevant information about the item.
- Search for specific items, so I can see their scores and read reviews about them.
- Sign up for an account so I can have a logged-in experience.
- Log in to the site if I already have an account.

AS A LOGGED-IN USER, I SHOULD BE ABLE TO:
- Write and submit a review for an item that includes:
    - A written text review
    - A score/rating
    - Only one review should be allowed per item, per user
- View a list of all reviews I have written.
- Delete reviews I have written.
- Edit reviews I have written.
    - Change the text review.
    - Modify the score/rating.
- Write comments on reviews written by others.
- View a list of all comments I have written.
- Edit and delete my comments.

AS AN ENGINEER, I SHOULD:
- Have a well-seeded database so that I can simulate several different scenarios for the user stories below.
    - By doing this, you set yourselves up to tackle many of the points throughout the tiers. In the long run, this will potentially save you tons of time.
    - For example, seed hundreds of items and reviews with dummy data so that when you get to the “pagination” user story, you won’t have to worry about adding more.
    - Also, add a bunch of users with reviews so the review editing features can be worked on without already having the “write a review” functionality built.
- Have secured user data so that no one can unrightfully manipulate information.

Required routes:

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me 🔒

GET /api/items
GET /api/items/:itemId
GET /api/items/:itemId/reviews

GET /api/items/:itemId/reviews/:reviewId
POST /api/items/:itemId/reviews 🔒
GET /api/reviews/me 🔒
PUT /api/users/:userId/reviews/:reviewId 🔒

POST /api/items/:itemId/reviews/:reviewId/comments 🔒
GET /api/comments/me 🔒
PUT /api/users/:userId/comments/:commentId 🔒
DELETE /api/users/:userId/comments/:commentId 🔒
DELETE /api/users/:userId/reviews/:reviewId 🔒
