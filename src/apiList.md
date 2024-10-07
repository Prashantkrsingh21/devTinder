## DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/forgot/password

## connectionRequestRouter

- POST /request/send/:status/:userId => [interested, ignored]

- POST /request/review/:status/:requestId => [accepted, rejeted]

## userRouter

- GET /user/requests/received
- GET /user/connections
- GET /user/feed => Gets you the profile of other users on the app
