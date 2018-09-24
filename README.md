# music-shop-online
online platform to purchase music
Fetch songs from iTunes API based on artist name and make it available for purchase using stripe payment gateway. This project is meant only for practice purpose no Copyright to any API is intended.

Steps :
1. node app.js
2. http://localhost:3000/index
3. Enter 'John Mayer' in the text box hit enter (I have updated songs only for this particular artist as off now).
4. Click on 'Buy' button, songs will be added in Shopping Cart.
5. Session will last for 5min after that Shopping Cart will reset to null.
6. Click on Shopping Cart(at top right of the page) to see price and song name.
7. Click on Checkout button.
8. After successful payment user redirected to Profile page.


ToDo :
1. Load more artists data in db.
2. Send notification email once order is placed.
3. Implement cancel order functionality.
